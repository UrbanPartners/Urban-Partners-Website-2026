import Layout from '@/components/Layout/Layout'
import { GlobalSettingsProvider } from '@/context/GlobalSettings'
import { getSiteSettings } from '@/data/sanity'
import { draftMode } from 'next/headers'

export const LanguageLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any
}) => {
  const paramsData = await params
  const { isEnabled } = await draftMode()
  const siteSettings = await getSiteSettings({ isPreview: isEnabled, language: paramsData.language })
  return (
    <GlobalSettingsProvider
      globalSettingsData={siteSettings || null}
      isPreviewMode={isEnabled}
      hasSanityPreviewToken={Boolean(process.env.SANITY_PREVIEW_TOKEN)}
    >
      <Layout>{children}</Layout>
    </GlobalSettingsProvider>
  )
}

LanguageLayout.displayName = 'LanguageLayout'

export default LanguageLayout
