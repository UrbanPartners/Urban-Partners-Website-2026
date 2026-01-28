import { groq } from 'next-sanity'
import link from './link'

export const fields = groq`
  count(headerLinksLeftSide) > 0 => {
    headerLinksLeftSide[] {
    ${link.fragment('link')},
      hasArrow,
    },
  },
  count(headerLinksRightSide) > 0 => {
    headerLinksRightSide[] {
      ${link.fragment('link')},
      hasArrow,
    }
  }
`

export const fragment = (name = 'navigation') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
