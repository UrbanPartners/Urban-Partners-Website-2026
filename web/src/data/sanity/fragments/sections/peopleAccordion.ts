import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'
import person from '../person'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  items[] {
    _key,
    title,
    description[] {${getRichTextFields({})}},
    people[] -> {${person.fields}},
  }
`

export const fragment = (name = 'peopleAccordion') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
