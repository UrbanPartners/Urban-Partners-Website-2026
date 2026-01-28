import imageAsset from './imageAsset'

export const fields = `
  _key,
  _type,
  companyTitle,
  companyDescription,
  ${imageAsset.fragment('image')},
  addressInfo {
    country,
    region,
    locality,
    postalCode,
    streetAddress
  },
  telephone,
  email,
  foundingDate,
  numberOfEmployees,
  otherLinks[]
`

export const fragment = (name = 'orgStructuredData') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
