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
import PreviewModeBadge from '@/components/PreviewModeBadge/PreviewModeBadge'

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isEnabled } = await draftMode()
  return (
    <html suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        {process.env.NEXT_PUBLIC_MATOMO_CONTAINER && (
          <Script
            strategy="beforeInteractive"
            id="matomo-container"
          >
            {`
              window.addEventListener('CookiebotOnAccept', function (e) {
                if (Cookiebot.consent.statistics) {
                  console.log("Loading Matomo");
                  loadMatomo();
                }
              });

              function loadMatomo() {
                var _mtm = window._mtm = window._mtm || [];
                _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
                (function() {
                  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                  g.async=true; g.src='https://matomo.nrep.com/js/container_${process.env.NEXT_PUBLIC_MATOMO_CONTAINER}.js'; s.parentNode.insertBefore(g,s);
                })();
              }
            `}
          </Script>
        )}
        {process.env.NEXT_PUBLIC_COOKIE_BOT_ID && (
          <Script
            strategy="beforeInteractive"
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={process.env.NEXT_PUBLIC_COOKIE_BOT_ID}
            data-blockingmode="auto"
            type="text/javascript"
          />
        )}
        <PreviewModeBadge
          isPreviewMode={isEnabled}
          hasSanityPreviewToken={Boolean(process.env.SANITY_PREVIEW_TOKEN)}
        />
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
        {process.env.NEXT_PUBLIC_COOKIE_BOT_ID && (
          <Script
            id="CookieDeclaration"
            src={`https://consent.cookiebot.com/${process.env.NEXT_PUBLIC_COOKIE_BOT_ID}/cd.js`}
            type="text/javascript"
            async
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  )
}
