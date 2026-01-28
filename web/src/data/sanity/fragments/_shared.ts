import { DEFAULT_LANGUAGE, DOC_TYPES, LANGUAGES } from '@/data'
import metadata from './metadata'
import blogPost from './blogPost'
import caseStudy from './caseStudy'
import pageData from './pageData'
import { groq } from 'next-sanity'
import { getMergedLanguageQueryString } from '@/data/sanity/utils'
import { imageAsset } from '@/data/sanity/fragments'

const languageArray = Object.values(LANGUAGES)

export const pageTitleFields = groq`
  "title": coalesce(${DEFAULT_LANGUAGE}Title, null),
      ${languageArray
        .map(language => {
          if (language === DEFAULT_LANGUAGE) {
            return null
          }
          return `
          $language == "${language}" => {
            defined(${language}Title) => {
              "title": ${language}Title
            }
          }
        `
        })
        .filter(Boolean)
        .join(',')}
`

/* eslint-disable */
export const pageMetadataFields = groq`
  _type,
  _createdAt,
  _updatedAt,
  ${pageTitleFields},
  slug,
  metadata {
    ${languageArray
      .map(language => {
        return `
        $language == "${language}" => {
          ...(${language}Metadata) {
            ${metadata.fields}
          }
        }
      `
      })
      .join(',')}
  },
  ${languageArray
    .map(language => {
      return `
      $language == "${language}" => {
        "isEnabled": $language in isEnabled
      }
    `
    })
    .join(',')},
  _type == "${DOC_TYPES.PAGE}" => {
    ${pageData.fields}
  },
  _type == "${DOC_TYPES.BLOG_POST}" => {
    ${blogPost.fields}
  },
  _type == "${DOC_TYPES.CASE_STUDY}" => {
    ${caseStudy.fields}
  },
  "globalMetaData": {
    ...(*[_type == "globalSettings"] {
      _type,
      ...(${DEFAULT_LANGUAGE}SiteSettingsMetadata) {
        ${metadata.fields}
      },
      ${languageArray
        .map(language => {
          return `
          $language == "${language}" => {
            ...(${language}SiteSettingsMetadata) {
              ${metadata.fields}
            }
          }
        `
        })
        .join(',')}
    }[0])
  }
`

export const pageSitemapFields = `
  _type,
  _updatedAt,
  slug,
  metadata {
    ${languageArray
      .map(language => {
        return `
        $language == "${language}" => {
          ...(${language}Metadata) {
            allowCrawlers
          }
        }
      `
      })
      .join(',')}
  },
  ${languageArray
    .map(language => {
      return `
      $language == "${language}" => {
        "isEnabled": $language in isEnabled
      }
    `
    })
    .join(',')},
`

export const cardFieldsByType = {
  [DOC_TYPES.BLOG_POST]: groq`
    _id,
    _type,
    ${pageTitleFields},
    "slug": slug.current,
    ...(blogPostData) {
      ${getMergedLanguageQueryString('BlogPostData', [
        {
          name: 'summary',
          alias: 'description',
          noFields: true,
        },
        {
          name: 'image',
          fields: imageAsset.fields,
        },
        {
          name: 'publishedDate',
          alias: 'publishedDate',
          noFields: true,
        },
      ])}
    }
  `,
  [DOC_TYPES.CASE_STUDY]: groq`
    _id,
    _type,
    ${pageTitleFields},
    "slug": slug.current,
    ...(caseStudyData) {
      ${getMergedLanguageQueryString('CaseStudyData', [
        {
          name: 'summary',
          alias: 'description',
          noFields: true,
        },
        {
          name: 'image',
          fields: imageAsset.fields,
        },
      ])}
    }
  `,
  [DOC_TYPES.PAGE]: groq`
    _id,
    _type,
    ${pageTitleFields},
    "slug": slug.current,
  `,
}

// eslint-disable-next-line
export const cardFields = Object.keys(cardFieldsByType as any)
  .map(type => `_type == "${type}" => { ${cardFieldsByType[type as keyof typeof cardFieldsByType]} }`)
  .join(',')

/* eslint-enable */
