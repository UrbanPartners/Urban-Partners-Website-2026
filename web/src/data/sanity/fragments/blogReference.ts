import { getMergedLanguageQueryString } from '@/data/sanity/utils'
import { groq } from 'next-sanity'

export const fields = groq`
  ${getMergedLanguageQueryString('Data', ['title'])},
  slug,
  _id
`

export const fragment = (name = 'blogReference') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
