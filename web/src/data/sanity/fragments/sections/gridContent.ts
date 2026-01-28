import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  "firstRowColumns": coalesce(firstRowColumns, 2),
  caption,
  items[] {
    _key,
    content[] {${getRichTextFields({})}}
  }
`

export const fragment = (name = 'gridContent') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
