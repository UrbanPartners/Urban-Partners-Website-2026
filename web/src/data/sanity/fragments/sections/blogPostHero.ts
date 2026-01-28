import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
`

export const fragment = (name = 'blogPostHero') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
