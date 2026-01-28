import { groq } from 'next-sanity'
import imageAsset from './imageAsset'
import vimeoData from '@/data/sanity/fragments/vimeoData'

export const fields = groq`
  ${vimeoData.fragment('vimeoData')},
  ${imageAsset.fragment('previewImage')},
  "previewOverlayOpacity": coalesce(previewOverlayOpacity, 40)
`

export const fragment = (name = 'videoPlayer') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
