import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  title,
  description[] {${getRichTextFields({})}},
  items[] {
    _key,
    title,
    description
  }
`

export const fragment = (name = 'factList') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
