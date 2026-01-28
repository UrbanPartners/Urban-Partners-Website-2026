import PageRenderer from '@/components/PageRenderer/PageRenderer'
import { DOC_TYPES, HOME_SLUG, LANGUAGES } from '@/data'
import { getFormattedMetadata } from '@/utils'
import { draftMode } from 'next/headers'

export async function generateStaticParams() {
  return Object.values(LANGUAGES).map(language => ({
    language,
  }))
}

export const generateMetadata = async ({ params }: { params: Promise<{ language: string }> }) => {
  const { isEnabled } = await draftMode()
  const paramsData = await params

  return await getFormattedMetadata(HOME_SLUG, DOC_TYPES.PAGE, isEnabled, paramsData.language)
}

export default async function Home({ params }: { params: Promise<{ language: string }> }) {
  const { isEnabled } = await draftMode()
  const paramsData = await params

  return (
    <PageRenderer
      slug={HOME_SLUG}
      docType={DOC_TYPES.PAGE as 'page'}
      isDraftMode={isEnabled}
      language={paramsData.language}
    />
  )
}
