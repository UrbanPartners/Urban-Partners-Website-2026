import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'
import imageAsset from '../imageAsset'
import itemList from '../itemList'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  items[] {
    _key,
    title,
    ${imageAsset.fragment('image')},
    description[] {${getRichTextFields({})}},
    bigNumber,
    bigNumberSubtitle,
    ${itemList.fragment('itemList')},
  }
`

export const fragment = (name = 'imageAndTextAccordion') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
