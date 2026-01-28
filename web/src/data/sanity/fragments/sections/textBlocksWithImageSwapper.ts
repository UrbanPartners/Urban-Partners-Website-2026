import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'
import imageAsset from '../imageAsset'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  items[] {
    _key,
    title,
    description[] {${getRichTextFields({})}},
    ${imageAsset.fragment('image')},
  }
`

export const fragment = (name = 'textBlocksWithImageSwapper') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
