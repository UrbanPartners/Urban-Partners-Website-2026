import { groq } from 'next-sanity'
import link from './link'

export const fields = groq`
  count(secondaryLinks) > 0 => {
    secondaryLinks[]{${link.fields}},
  },
  count(sideLinks) > 0 => {
    sideLinks[]{${link.fields}},
  },
  count(legalLinks) > 0 => {
    legalLinks[]{${link.fields}},
  },
  defined(legalText) => {
    legalText
  }
`

export const fragment = (name = 'menu') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
