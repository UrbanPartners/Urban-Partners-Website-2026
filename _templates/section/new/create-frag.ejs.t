---
to: web/src/data/sanity/fragments/sections/<%= h.inflection.camelize( name, true ) %>.ts
---
import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
`

export const fragment = (name = '<%= h.inflection.camelize( name, true ) %>') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
