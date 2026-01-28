import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'
import mediaAsset from '../mediaAsset'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  title,
  subtitle,
  description[] {${getRichTextFields({})}},
  ${mediaAsset.fragment('mediaAsset')},
  mediaSize,
  "mediaHeight": coalesce(mediaHeight, "default"),
  showArrow,
`

export const fragment = (name = 'largeTitleHeroWithMedia') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
