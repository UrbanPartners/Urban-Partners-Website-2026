import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import blogCategory from '../blogCategory'
import blogReference from '../blogReference'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  title,
  "hideDropdowns": coalesce(hideDropdowns, false),
  "blogCategories": *[_type == "blogCategory"] {${blogCategory.fields}},
  "blogReferences": *[_type == "blogReference"] {${blogReference.fields}},
`

export const fragment = (name = 'newsSearchAndTitle') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
