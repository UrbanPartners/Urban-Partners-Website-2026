import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'
import link from '../link'
import itemList from '../itemList'
import { mediaAsset } from '@/data/sanity/fragments'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  items[] {
    _key,
    title,
    description[] {${getRichTextFields({})}},
    ${link.fragment('cta')},
    ${itemList.fragment('itemList')},
    ${mediaAsset.fragment('media')}
  }
`

export const fragment = (name = 'expandingImageAndContent') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
