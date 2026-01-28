import { draftMode } from 'next/headers'
import { Metadata } from 'next'
import { DEFAULT_LANGUAGE, DIRECTORY_NAMES, DOC_TYPES, HOME_SLUG } from '@/data'

// import useStore from '@/store'
import { getFormattedMetadata, slugArrayToSlug, slugPathToSlugArray } from '@/utils'
import { client, getAllPages } from '@/data/sanity'
import PageRenderer from '@/components/PageRenderer/PageRenderer'

export const dynamicParams = true
export const revalidate = 604800 // All of this is revalidated through /api/revalidate webhook
// export const dynamic = 'force-dynamic'

const getDocTypeAndSlugFromParams = async (params: { slug: string[] }, language: string, isPreview: boolean) => {
  if (!language) {
    throw new Error(`No language found for params passed ${JSON.stringify(params)}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pageSlugs: any = await getAllPages(DOC_TYPES.PAGE, isPreview, language)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageSlugs = pageSlugs.map((page: any) => page?.slug?.current).filter(Boolean)

  if (!pageSlugs?.length) {
    throw new Error('No page slugs found')
  }

  let docType: string = DOC_TYPES.PAGE

  // No slug, show home
  if (!params?.slug?.length || Object.keys(params).length === 0) {
    return { docType: DOC_TYPES.PAGE, slug: [HOME_SLUG] }
  }

  // let slug = decodeURIComponent(params?.slug[0]).split('/')
  let slug = null

  if (!pageSlugs?.length) {
    throw new Error('No page slugs found')
  }

  const isPageInSanity = pageSlugs?.includes(slugArrayToSlug(params?.slug))

  // If the page exists in Sanity, show it before going to templated pages
  if (isPageInSanity) {
    return { docType: DOC_TYPES.PAGE, slug: params?.slug }
  }

  // Blog Posts
  if (params?.slug[0] === DIRECTORY_NAMES.BLOG_POSTS && params?.slug?.length === 2) {
    docType = DOC_TYPES.BLOG_POST
    slug = [params?.slug[1]]
  }

  // Case Studies
  if (params?.slug[0] === DIRECTORY_NAMES.CASE_STUDIES && params?.slug?.length === 2) {
    docType = DOC_TYPES.CASE_STUDY
    slug = [params?.slug[1]]
  }

  return { docType, slug }
}

/* eslint-disable  */

export async function generateStaticParams() {
  const types = [DOC_TYPES.PAGE]

  let result = await client.fetch(
    `*[_type in $types] {
      slug,
      _type,
    }`,
    { types },
  )

  result = result.filter((item: any) => item?.slug?.current && item?._type)

  const pages = result.filter((item: any) => item._type === DOC_TYPES.PAGE)

  const items: any[] = []
  const hashMap: any = {}

  // home
  items.push({
    slug: [],
  })

  pages.forEach((page: any) => {
    let slug = page?.slug?.current
    slug = decodeURIComponent(slug)

    if (!hashMap[slug]) {
      hashMap[slug] = true
      items.push({
        slug: slugPathToSlugArray(page.slug.current),
      })
    }
  })

  if (!pages) {
    return []
  }

  return items
}

/* eslint-enable  */

type ParamsType = { params: Promise<{ slug: string[]; language: string }> }

export const generateMetadata = async ({ params }: ParamsType): Promise<Metadata> => {
  const paramsData = await params
  const { isEnabled } = await draftMode()
  const { docType, slug } = await getDocTypeAndSlugFromParams(paramsData, paramsData.language, isEnabled)

  let slugAsString = slugArrayToSlug(slug as string[])
  slugAsString = decodeURIComponent(slugAsString)

  if (slugAsString === null || slugAsString === 'null') {
    slugAsString = HOME_SLUG
  }

  return await getFormattedMetadata(slugAsString, docType, isEnabled, paramsData.language)
}

export default async function Page({ params }: ParamsType) {
  let paramsData = await params
  const { isEnabled } = await draftMode()

  // For default language redirect...
  if (paramsData.slug.length === 1 && paramsData.slug[0] === DEFAULT_LANGUAGE) {
    paramsData = {
      ...paramsData,
      slug: [],
    }
  }

  const { docType, slug } = await getDocTypeAndSlugFromParams(paramsData, paramsData.language, isEnabled)

  let slugAsString = slugArrayToSlug(slug as string[])
  slugAsString = decodeURIComponent(slugAsString)

  return (
    <PageRenderer
      slug={slugAsString}
      docType={docType as 'page'}
      isDraftMode={isEnabled}
      language={paramsData.language}
    />
  )
}
