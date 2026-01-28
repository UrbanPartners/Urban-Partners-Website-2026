import imageAsset from './imageAsset'

export const fields = `
  _key,
  defined(title) => {
    title
  },
  defined(description) => {
    description
  },
  defined(keywords) => {
    keywords
  },
  defined(allowCrawlers) => {
    allowCrawlers
  },
  defined(image) => {
    image {${imageAsset.fields}}
  },
  defined(favicon) => {
    favicon {${imageAsset.fields}}
  },
  defined(metaBackgroundColorHex) => {
    metaBackgroundColorHex
  },
  defined(themeColorHex) => {
    themeColorHex
  }
`

export const fragment = (name = 'metadata') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
