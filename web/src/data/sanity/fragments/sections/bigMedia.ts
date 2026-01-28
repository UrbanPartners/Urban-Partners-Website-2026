import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { mediaAsset } from '@/data/sanity/fragments'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  ${mediaAsset.fragment()},
  "size": coalesce(size, "full"),
  "height": coalesce(height, "default"),
  "position": coalesce(position, "right"),
  customAspectRatio
`

export const fragment = (name = 'bigMedia') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
