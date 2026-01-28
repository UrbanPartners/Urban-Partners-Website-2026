import { getRichTextFields } from '@/data/sanity/utils'

export const fields = `
  _key,
  _type,
  title,
  items[] {
    _key,
    title,
    description[] {${getRichTextFields({})}}
  }
`

export const fragment = (name = 'itemList') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
