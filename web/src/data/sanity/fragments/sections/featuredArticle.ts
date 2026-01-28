import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import link from '../link'
import imageAsset from '../imageAsset'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  "variant": coalesce(variant, "a"),
  ${link.fragment('linksTo')},
  title,
  description,
  ${imageAsset.fragment('image')},
`

export const fragment = (name = 'featuredArticle') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
