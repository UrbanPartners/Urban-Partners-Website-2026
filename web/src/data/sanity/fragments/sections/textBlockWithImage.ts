import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'
import imageAsset from '../imageAsset'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  description[] {${getRichTextFields({})}},
  subheader,
  bottomText[] {${getRichTextFields({})}},
  ${imageAsset.fragment('image')},
`

export const fragment = (name = 'textBlockWithImage') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
