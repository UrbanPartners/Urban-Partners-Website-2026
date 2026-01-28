import metadata from './metadata'
import navigation from './navigation'
import menu from './menu'
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/data'
import { groq } from 'next-sanity'
import preloader from './preloader'

/* eslint-disable */

export const fields = groq`
  _type,
  "navigation": {
      ...(${DEFAULT_LANGUAGE}NavigationSettings) {
        ${navigation.fields}
      },
      ${Object.values(LANGUAGES)
        .map(language => {
          if (language === DEFAULT_LANGUAGE) return null
          return `
            $language == "${language}" => {
              ...(${language}NavigationSettings) {
                ${navigation.fields}
              }
            }

          `
        })
        .filter(Boolean)
        .join(',')}
    },
    "menu": {
      ...(${DEFAULT_LANGUAGE}MenuSettings) {
        ${menu.fields}
      },
      ${Object.values(LANGUAGES)
        .map(language => {
          if (language === DEFAULT_LANGUAGE) return null
          return `
            $language == "${language}" => {
              ...(${language}MenuSettings) {
                ${menu.fields}
              }
            }
          `
        })
        .filter(Boolean)
        .join(',')}
    },
    "metadata": {
      ...(${DEFAULT_LANGUAGE}SiteSettingsMetadata) {
        ${metadata.fields}
      },
      ${Object.values(LANGUAGES)
        .map(language => {
          if (language === DEFAULT_LANGUAGE) return null
          return `
            $language == "${language}" => {
              ...(${language}SiteSettingsMetadata) {
                ${metadata.fields}
              }
            }
          `
        })
        .filter(Boolean)
        .join(',')}
    },
    "preloader": {
      ...(${DEFAULT_LANGUAGE}PreloaderSettings) {
        ${preloader.fields}
      },
      ${Object.values(LANGUAGES)
        .map(language => {
          if (language === DEFAULT_LANGUAGE) return null
          return `
            $language == "${language}" => {
              ...(${language}PreloaderSettings) {
                ${preloader.fields}
              }
            }
          `
        })
        .filter(Boolean)
        .join(',')}
    }
`

/* eslint-enable */

export const fragment = (name = 'siteSettings') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
