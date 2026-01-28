import { groq } from 'next-sanity'

export const fields = groq`
  count(rotatingTexts) > 0 => {
    rotatingTexts
  },
  defined(rotatingTextSuffix) => {
    rotatingTextSuffix
  }
`

export const fragment = (name = 'menu') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
