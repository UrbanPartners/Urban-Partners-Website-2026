import PageRenderer from '@/components/PageRenderer/PageRenderer'
import { DOC_TYPES, FOUR_OH_FOUR_SLUG, LANGUAGES } from '@/data'
import { getFormattedMetadata } from '@/utils'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'

export async function generateStaticParams() {
  return Object.values(LANGUAGES).map(language => ({ language }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateMetadata = async ({ params }: any): Promise<Metadata> => {
  const { isEnabled } = await draftMode()
  const paramsData = await params
  return await getFormattedMetadata(FOUR_OH_FOUR_SLUG, DOC_TYPES.PAGE, isEnabled, paramsData.language)
}

export default async function _404Landing() {
  const { isEnabled } = await draftMode()

  return (
    <PageRenderer
      slug={FOUR_OH_FOUR_SLUG}
      docType={DOC_TYPES.PAGE as 'page'}
      isDraftMode={isEnabled}
      language={LANGUAGES.EN}
    />
  )
}
