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
          return null
        }

        return {
          source: redirect.source,
          destination: redirect.destination,
          permanent: redirect.type === 'permanent',
        }
      })
      .filter(Boolean)

    console.warn(`Adding ${redirects.length} redirects to next.config.ts`)

    return redirects
  },
}

export default nextConfig
