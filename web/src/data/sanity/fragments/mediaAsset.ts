import imageAsset from './imageAsset'
import video from './video'
import videoPlayer from './videoPlayer'
import { groq } from 'next-sanity'

export const fields = groq`
  ...media[0] {
    _type,
    _type == "imageAsset" => {
      ${imageAsset.fields}
    },
    _type == "video" => {
      ${video.fields}
    },
    _type == "videoPlayer" => {
      ${videoPlayer.fields}
    }
  }
`

export const fragment = (name = 'mediaAsset') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
