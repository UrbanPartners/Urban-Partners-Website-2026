import cmsSettings from '../cmsSettings'
import { imageAsset } from '@/data/sanity/fragments'

export const fields = `
  _type,
  _id,
  ${cmsSettings()},
  mediaType,
  ${imageAsset.fragment('image')}
`

export const fragment = (name = 'fourOhFour') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
