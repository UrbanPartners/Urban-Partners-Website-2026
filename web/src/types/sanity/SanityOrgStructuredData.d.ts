type SanityOrgStructuredData = {
  _key: string
  _type: string
  companyTitle: string
  companyDescription: string
  image: SanityImage
  addressInfo: {
    country: string
    region: string
    locality: string
    postalCode: string
    streetAddress: string
  }
  telephone: string
  email: string
  foundingDate: string
  numberOfEmployees: string
  otherLinks: string[]
}
