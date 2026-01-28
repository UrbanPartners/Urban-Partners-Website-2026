import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'
import button from '../button'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  number,
  description[] {${getRichTextFields({})}},
  subheading,
  subheadingDescription[] {${getRichTextFields({})}},
  ${button.fragment('cta')},
`

export const fragment = (name = 'numberAndText') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
