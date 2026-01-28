import { ClientConfig, createClient, groq } from 'next-sanity'
import { page, siteSettings } from '@/data/sanity/fragments'
import { mergeSiteSettings } from '@/utils'
import { DOC_TYPES, LANGUAGES, SANITY_EVERYTHING_TAG } from '@/data'
import { pageSitemapFields } from '@/data/sanity/fragments/_shared'
import { formatPage } from '@/data/sanity/pageFormatter'

let perspective = process.env.SANITY_PREVIEW_TOKEN === undefined ? 'published' : 'drafts'
if (process.env.NODE_ENV === 'development') {
  perspective = 'raw'
}

const SANITY_CONFIG: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  // useCdn: process.env.SANITY_PREVIEW_TOKEN === undefined ? true : false,
  useCdn: false,
  token: process.env.SANITY_PREVIEW_TOKEN,
  perspective: perspective as 'raw' | 'published' | 'previewDrafts',
}

export const client = createClient(SANITY_CONFIG)

const revalidateDefaultPeriod = parseInt(process.env.REVALIDATE || '604800') // 1 week revalidation
const revalidate = process.env.NODE_ENV !== 'production' ? 0 : revalidateDefaultPeriod

export const getSiteSettings = async ({ isPreview, language }: { isPreview: boolean; language?: string }) => {
  if (!language) language = LANGUAGES.EN

  const query = groq`
    *[_type == "globalSettings"][0] {
      ${siteSettings.fields}
    }
  `

  /* eslint-disable */
  const siteSettingsData: SanitySiteSettingsResponse = await client.fetch(
    query,
    { isPreview: Boolean(isPreview), language },
    {
      next: {
        revalidate,
        tags: [SANITY_EVERYTHING_TAG],
      },
    },
  )

  /* eslint-enable */

  if (!siteSettingsData) return null

  if (!Object.keys(siteSettingsData).length) return null

  return siteSettingsData
}

export const getPage = async (slug: string, type = 'page', isPreview: boolean, language?: string) => {
  if (!language) language = LANGUAGES.EN

  if (!Object.values(DOC_TYPES).includes(type)) {
    console.warn(`Invalid type fetching in getPage: ${type}`)
    return
  }

  const query = `
    *[_type == "${type}" && slug.current == "${slug}"] {
      ${page.getFields()}
    }
  `

  const response = (
    await client.fetch(
      query,
      { isPreview: Boolean(isPreview), language },
      {
        next: {
          revalidate,
          tags: [SANITY_EVERYTHING_TAG],
        },
      },
    )
  )[0]

  if (!response || !siteSettings) return null

  const merged = mergeSiteSettings(response, response.globalMetaData) as SanityPage
  const formattedPage = formatPage(merged, language)
  return formattedPage as SanityPage
}

export const getAllPages = async (
  type = DOC_TYPES.PAGE,
  isPreview?: boolean,
  language?: string,
  isSitemapGeneration?: boolean,
) => {
  if (!language) language = LANGUAGES.EN

  const tags = [SANITY_EVERYTHING_TAG]
  const docTypes = typeof DOC_TYPES === 'object' && Object.keys(DOC_TYPES).length > 0 ? Object.values(DOC_TYPES) : []
  const docTypesOrCondition = docTypes.map(type => `_type == "${type}"`).join(' || ')
  const sitemapQuery = ` *[${docTypesOrCondition}] {
      ${pageSitemapFields}
    }
  `
  const pagesQuery = `*[_type == "${type}"] {
      ${page.getMinimalFields()}
    }
  `

  const pages = await client.fetch(
    isSitemapGeneration ? sitemapQuery : pagesQuery,
    { isPreview: Boolean(isPreview), language },
    {
      next: {
        revalidate,
        tags,
      },
    },
  )

  if (!pages.length) return null

  return pages as SanityPage[]
}

export const getAllPagesForAllLanguages = async (
  type = DOC_TYPES.PAGE,
  isPreview?: boolean,
  isSitemapGeneration?: boolean,
) => {
  let data: SanityPageWithLanguage[] = []
  const slugTypeHashmap: { [key: string]: string } = {}

  for (const lang of Object.values(LANGUAGES)) {
    const pageData = await getAllPages(type, isPreview, lang, isSitemapGeneration)
    const newData: SanityPageWithLanguage[] = []

    pageData?.forEach((page: SanityPage) => {
      const key = `${page?._type}_${page?.slug?.current}_${lang}`
      if (slugTypeHashmap[key]) return
      slugTypeHashmap[key] = 'true'
      newData.push({ ...page, language: lang })
    })

    data = [...data, ...newData]
  }

  if (!data.length) return []

  return data as SanityPageWithLanguage[]
}
