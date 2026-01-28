import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  "hasLine": coalesce(hasLine, false),
  "topDesktop": coalesce(topDesktop, "auto"),
  "topMobile": coalesce(topMobile, "auto"),
  "bottomDesktop": coalesce(bottomDesktop, "auto"),
  "bottomMobile": coalesce(bottomMobile, "auto"),
  "desktop": coalesce(desktop, "auto"),
  "mobile": coalesce(mobile, "auto"),
  "lineWidth": coalesce(lineWidth, "section-container")
`

export const fragment = (name = 'spacer') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
