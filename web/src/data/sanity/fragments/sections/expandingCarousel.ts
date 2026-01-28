import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { cardFields } from '../_shared'
import customCard from '../customCard'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  numberPrefix,
  items[]{
    _type == "customCard" => {
      ${customCard.fields}
    },
    !(_type == "customCard") => @->{
      ${cardFields}
    }
  }
`

export const fragment = (name = 'expandingCarousel') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
