import { groq } from 'next-sanity'
import vimeoData from './vimeoData'

export const fields = groq`
  ${vimeoData.fragment('vimeoData')}
`

export const fragment = (name = 'video') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
