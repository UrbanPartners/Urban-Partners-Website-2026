import { getMergedLanguageQueryString } from '@/data/sanity/utils'
import { groq } from 'next-sanity'
import imageAsset from '@/data/sanity/fragments/imageAsset'

export const fields = groq`
  firstName,
  lastName,
  'fullName': coalesce(firstName + ' ' + lastName, firstName),
  ${getMergedLanguageQueryString('PersonData', [
    'designation',
    'email',
    'linkedInUrl',
    {
      name: 'image',
      fields: imageAsset.fields,
    },
  ])},
  slug
`

export const fragment = (name = 'person') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
