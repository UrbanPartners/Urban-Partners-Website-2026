import { DEFAULT_LANGUAGE, LANGUAGES } from '@/data'
import { groq } from 'next-sanity'
import link from './fragments/link'

export const getMergedLanguageQueryString = (
  objectSuffix: string,
  fieldsArray: (
    | string
    | { name: string; fields?: string; dereference?: boolean; isArray?: boolean; alias?: string; noFields?: boolean }
  )[],
) => {
  let defaultQueryString = ''
  let localizedQueryString = ''

  fieldsArray.forEach(item => {
    if (typeof item === 'string') {
      defaultQueryString += `${item},`
      localizedQueryString += `defined(${item}) => {"${item}": ${item}},`
    } else if (typeof item === 'object' && item !== null) {
      // if (item.alias) {
      //   defaultQueryString += `"${item.alias}":`
      //   localizedQueryString += `"${item.alias}":`
      // }

      if (item.noFields) {
        defaultQueryString += `${item.alias ? `"${item.alias}":` : ''}${item.name},`
        localizedQueryString += `defined(${item.name}) => {"${item.alias || item.name}": ${item.name}},`
      } else {
        const arrString = item.isArray ? '[]' : ''
        defaultQueryString += `${item.alias ? `"${item.alias}":` : ''}${item?.dereference ? `${item.name} ${arrString}->` : `${item.name}${arrString}`} {${
          item.fields
        }},`
        localizedQueryString += `
        defined(${item.name}) => {
          ${item?.dereference ? `'${item.alias || item.name}': ${item.name} ${arrString}->` : `'${item.name}${arrString}': `} {
            ${item.fields}
          }
        },
        `
      }
    }
  })

  const query = `
    ${Object.values(LANGUAGES)
      .map(language => {
        if (language === DEFAULT_LANGUAGE) {
          return `
            $language == "${DEFAULT_LANGUAGE}" => {
              ...(${DEFAULT_LANGUAGE}${objectSuffix}) {
                ${defaultQueryString}
              }
            }
          `
        } else {
          return `
            $language == "${language}" => {
              ...(${DEFAULT_LANGUAGE}${objectSuffix}) {
                ${defaultQueryString}
              },
              ...(${language}${objectSuffix}) {
                ${localizedQueryString}
              }
            }
          `
        }
      })
      .join(',')}
  `

  return query
}

export const getMainDataOverrides = ({
  objectSuffix,
  mainDataOverrides,
  mainObjectName,
}: {
  objectSuffix: string
  mainObjectName: string
  mainDataOverrides: string[]
}) => {
  let query = ''
  if (mainObjectName && mainDataOverrides?.length) {
    query = `
     ${Object.values(LANGUAGES)
       .map(lang => {
         if (lang === DEFAULT_LANGUAGE) return ''
         return `
        ${mainDataOverrides
          .map(overrideString => {
            const objectPath = `${mainObjectName}.${lang}${objectSuffix}.${overrideString}`
            return `
            $language == "${lang}" => {
              defined(${objectPath}) => {"${overrideString}": ${objectPath}}
            },
          `
          })
          .join('')}
      `
       })
       .join('')}
  `
  }

  return query
}

export const getDomainNameFromUrlString = (urlString: string) => {
  const url = new URL(urlString)
  const domain = url.hostname
  return domain
}

export const getRichTextFields = ({
  childrenString = '',
  markDefsString = '',
  additionalFields = '',
  // eslint-disable-next-line
}: any) => {
  return groq`
    _key,
    _type,
    children[] {
      ...,
      _type == "link" => {
        ${link.fields}
      },
      ${childrenString}
    },
    style,
    listItem,
    level,
    markDefs[]{
      ...,
      _type == "link" => {
        ${link.fields}
      },
      ${markDefsString}
    },
    ${additionalFields}

  `
}
