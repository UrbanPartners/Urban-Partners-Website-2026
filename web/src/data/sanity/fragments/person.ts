import { getMergedLanguageQueryString, getRichTextFields } from '@/data/sanity/utils'
import { groq } from 'next-sanity'
import imageAsset from '@/data/sanity/fragments/imageAsset'

export const fields = groq`
  firstName,
  lastName,
  'fullName': coalesce(firstName + ' ' + lastName, firstName),
  ${getMergedLanguageQueryString('PersonData', [
    'designation',
    'designation2',
    'email',
    'phoneNumber',
    'location',
    'linkedInUrl',
    {
      name: 'image',
      fields: imageAsset.fields,
    },
    {
      name: 'bioSummary',
      isArray: true,
      fields: getRichTextFields({}),
    },
    {
      name: 'bio',
      isArray: true,
      fields: getRichTextFields({}),
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
