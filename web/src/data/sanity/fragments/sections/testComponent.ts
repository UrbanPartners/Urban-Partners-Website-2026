import cmsSettings from '../cmsSettings'
import { imageAsset } from '@/data/sanity/fragments'
import { link } from '@/data/sanity/fragments'
import { mediaAsset } from '@/data/sanity/fragments'

export const fields = `
  _type,
  _id,
  ${cmsSettings()},
  title,
  description,
  ${link.fragment('cta')},
  ${imageAsset.fragment('image')},
  ${mediaAsset.fragment('media')},
`

export const fragment = (name = 'testComponent') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
