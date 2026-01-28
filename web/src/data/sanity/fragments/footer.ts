import link from './link'

export const fields = `
  linkColumns[] {
    title,
    items[] {
      ${link.fields}
    }
  },
  socialMediaLinks[]{
    ${link.fields}
  },
  legal
`

export const fragment = (name = 'footer') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
