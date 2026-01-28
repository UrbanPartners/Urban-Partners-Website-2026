import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'
import itemList from '../itemList'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  items[] {
    _key,
    title,
    description[] {${getRichTextFields({})}},
    ${itemList.fragment('itemList')},
  }
`

export const fragment = (name = 'textAccordion') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
