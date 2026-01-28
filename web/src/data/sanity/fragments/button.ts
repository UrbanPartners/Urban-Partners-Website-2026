import link from './link'

export const fields = `
  _key,
  _type,
  ${link.fragment('link')},
  "icon": coalesce(icon, 'arrowRight')
`

export const fragment = (name = 'button') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
