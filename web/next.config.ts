import { DEFAULT_LANGUAGE, LANGUAGES } from '@/data'
import ROUTES_REDIRECTS from './src/utils/redirects'
import path from 'path'

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
    return [...ROUTES_REDIRECTS]
  },
}

export default nextConfig
