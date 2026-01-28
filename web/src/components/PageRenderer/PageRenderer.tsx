import Sections from '@/components/Sections/Sections'
import { FOUR_OH_FOUR_SLUG, LANGUAGES } from '@/data'
import { getPage } from '@/data/sanity'
import useStore from '@/store'
import { notFound } from 'next/navigation'

const PageRenderer = async ({
  slug,
  docType,
  isDraftMode,
  language,
}: {
  slug: string
  docType: 'page' | 'blogPost' | 'caseStudy'
  isDraftMode: boolean
  language?: string
}) => {
  const lang = language || LANGUAGES.EN
  const data = await getPage(slug, docType, isDraftMode, lang)

  const pageIsDisabled = !data?.isEnabled && !process.env.SANITY_PREVIEW_TOKEN && slug !== FOUR_OH_FOUR_SLUG
  if (!data || pageIsDisabled) return notFound()
  if (!data?.sections?.length) return null

  if (data.sections) {
    const firstSection = data.sections[0]
    if (firstSection?._type) {
      useStore.setState({ firstSectionType: firstSection?._type })
    }
  }

  return <Sections sections={data.sections} />
}

PageRenderer.displayName = 'PageRenderer'

export default PageRenderer
