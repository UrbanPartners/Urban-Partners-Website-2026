import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'
import link from '../link'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  "tallerContent": coalesce(tallerContent, false),
  items[] {
    _key,
    title,
    titleSubheader,
    description[] {${getRichTextFields({})}},
    bottomLinks[] {${link.fields}},
  }
`

export const fragment = (name = 'infoTiles') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
