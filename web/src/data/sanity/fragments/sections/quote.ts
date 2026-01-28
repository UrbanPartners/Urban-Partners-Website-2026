import cmsSettings from '@/data/sanity/fragments/cmsSettings'
import imageAsset from '@/data/sanity/fragments/imageAsset'
import { getRichTextFields } from '@/data/sanity/utils'
import { groq } from 'next-sanity'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  content[] {${getRichTextFields({})}},
  ${imageAsset.fragment('authorImage')},
  authorName,
  authorDesignation
`

export const fragment = (name = 'quote') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
