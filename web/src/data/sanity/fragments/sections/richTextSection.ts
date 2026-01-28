import { getRichTextFields } from '@/data/sanity/utils'
import cmsSettings from '../cmsSettings'
import { groq } from 'next-sanity'

export const fields = `
  _type,
  _id,
  ${cmsSettings()},
  content[] {
    ${getRichTextFields({
      additionalFields: groq`
        _type == "richTextBlockquote" => {
          _type,
          quote,
          author
        }
      `,
    })}
  }
`

export const fragment = (name = 'richTextSection') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
