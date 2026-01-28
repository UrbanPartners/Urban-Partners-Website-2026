import { getSiteSettings } from '@/data/sanity'
import '@/styles/global.scss'
import { formatMetadata } from '@/utils'
import { draftMode } from 'next/headers'
import type { Viewport } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
import { GTM_ID } from '@/utils'
import { WipeProvider } from '@/context/WipeContext'
import PageTransition from '@/components/PageTransition/PageTransition'
import Script from 'next/script'
import { PRELOADER_COOKIE_NAME } from '@/data'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const generateMetadata = async () => {
  const { isEnabled } = await draftMode()
  const siteSettings = await getSiteSettings({ isPreview: isEnabled })
  const metadata = siteSettings?.metadata
  return formatMetadata(metadata, null)
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <WipeProvider>
          <PageTransition>{children}</PageTransition>
        </WipeProvider>
        <Script
          id="preloader-cookie-check"
          strategy="beforeInteractive"
        >{`
          window.pageLoadTime = Date.now();
          
          // Check for preloader cookie and set data attribute
          (function() {
            var cookieName = '${PRELOADER_COOKIE_NAME}';
            var cookies = document.cookie.split(';');
            var hasViewedPreloader = false;
            
            for (var i = 0; i < cookies.length; i++) {
              var cookie = cookies[i].trim();
              if (cookie.indexOf(cookieName + '=') === 0) {
                hasViewedPreloader = true;
                break;
              }
            }
            
            if (hasViewedPreloader) {
              document.body.setAttribute('data-viewed-preloader', 'true');
            }
          })();
        `}</Script>
        {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
      </body>
    </html>
  )
}
