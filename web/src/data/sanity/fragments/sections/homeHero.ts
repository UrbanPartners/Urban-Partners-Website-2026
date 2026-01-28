import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { mediaAsset } from '@/data/sanity/fragments'
import { getRichTextFields } from '@/data/sanity/utils'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  title,
  titleMobile,
  ${mediaAsset.fragment('media')},
  "backgroundOverlay": coalesce(backgroundOverlay, 0),
  descriptionTitle[] {${getRichTextFields({})}},
  descriptionText[] {${getRichTextFields({})}}
`

export const fragment = (name = 'homeHero') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
