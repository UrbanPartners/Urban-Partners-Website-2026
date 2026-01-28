import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  title,
  items[] {
    _key,
    title,
    description[] {${getRichTextFields({})}},
  },
`

export const fragment = (name = 'basicAccordion') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
