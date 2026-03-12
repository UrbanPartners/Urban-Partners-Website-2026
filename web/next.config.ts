import { DEFAULT_LANGUAGE, LANGUAGES } from '@/data'
import { createClient } from 'next-sanity'
import path from 'path'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false,
})

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    additionalData: '@import "@/styles/shared";',
    quietDeps: true,
    implementation: require('sass'),
    silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin'], // Only silence valid deprecations
  },
  productionBrowserSourceMaps: true,
  async rewrites() {
    const languageRedirects = Object.values(LANGUAGES)
      .map(language => {
        if (language === DEFAULT_LANGUAGE) return null
        return {
          source: `/${language}/:path*`,
          destination: `/${language}/:path*`,
        }
      })
      .filter(Boolean)

    const defaultLanguageRedirects = [
      {
        source: '/',
        destination: `/${DEFAULT_LANGUAGE}`,
      },
      {
        source: '/:path*',
        destination: `/${DEFAULT_LANGUAGE}/:path*`,
      },
    ]

    return [
      {
        source: '/icon/:path*',
        destination: '/icon/:path*',
      },
      {
        source: '/apple-icon/:path*',
        destination: '/apple-icon/:path*',
      },
      ...languageRedirects,
      ...defaultLanguageRedirects,
    ]
  },
  async redirects() {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Not fetching redirects in non-production environment')
      return []
    }

    let redirects = await client.fetch(`*[_type == "redirect"]{
      source,
      destination,
      type,
      publishedDate
    }`)

    if (!redirects?.length) {
      console.warn('No redirects fetched from Sanity within next.config.ts')
      return []
    }

    redirects = redirects
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((redirect: any) => {
        if (!redirect?.source || !redirect?.destination || !redirect?.type) {
          console.warn('[next.config] skipping malformed redirect:', JSON.stringify(redirect))
          return null
        }

        const { source, destination } = redirect

        if (!destination.startsWith('/') && !destination.startsWith('http')) {
          console.warn(
            `[next.config] suspicious destination (no leading slash or http): "${destination}" (source: "${source}")`,
          )
        }

        if (source === destination) {
          console.warn(`[next.config] source === destination loop detected: "${source}"`)
          return null
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
        if (siteUrl && destination.startsWith(siteUrl)) {
          console.warn(
            `[next.config] destination points back to same domain — potential loop: "${source}" → "${destination}"`,
          )
        }

        return {
          source,
          destination,
          permanent: redirect.type === 'permanent',
        }
      })
      .filter(Boolean)

    console.warn(`Adding ${redirects.length} redirects to next.config.ts`)

    return redirects
  },
}

export default nextConfig
