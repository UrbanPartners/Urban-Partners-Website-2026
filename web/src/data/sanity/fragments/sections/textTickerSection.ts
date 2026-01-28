import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  title,
  rows[] {
    _key,
    items,
  },
`

export const fragment = (name = 'textTickerSection') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
