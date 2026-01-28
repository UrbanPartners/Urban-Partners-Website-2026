import { DEFAULT_LANGUAGE, LANGUAGES } from '@/data'

export const fields = `
  ${Object.values(LANGUAGES)
    .map(lang => {
      if (lang === DEFAULT_LANGUAGE) return ''
      return `
        $language == "${lang}" => {
          defined(${lang}Title) => {"title": ${lang}Title}
        },
      `
    })
    .join('')}
`

export const fragment = (name = 'pageData') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
