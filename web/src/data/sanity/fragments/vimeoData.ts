import { groq } from 'next-sanity'

export const fields = groq`
  vimeoId,
  name,
  thumbnailUrl,
  url240,
  url360,
  url540,
  url720,
  url1080,
  urlHls
`

export const fragment = (name = 'vimeoData') => `${name}{ ${fields} }`

const __exports = {
  fields,
  fragment,
}

export default __exports
