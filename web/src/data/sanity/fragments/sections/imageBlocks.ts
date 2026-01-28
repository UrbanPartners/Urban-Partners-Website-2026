import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import imageAsset from '@/data/sanity/fragments/imageAsset'
import { getRichTextFields } from '@/data/sanity/utils'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  ${imageAsset.fragment('image1')},
  ${imageAsset.fragment('image2')},
  title,
  description[] {${getRichTextFields({})}},
  "flippedPosition": coalesce(flippedPosition, false)
`

export const fragment = (name = 'imageBlocks') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
