import { groq } from 'next-sanity'
import imageAsset from './imageAsset'
import link from './link'

export const fields = groq`
  _key,
  _type,
  title,
  description,
  ${imageAsset.fragment('image')},
  ${link.fragment('link')}
`

export const fragment = (name = 'customCard') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
