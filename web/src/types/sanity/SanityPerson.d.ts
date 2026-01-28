type SanityPerson = {
  firstName: string
  lastName?: string
  fullName: string
  designation?: string
  linkedInUrl?: string
  email?: string
  image?: SanityImageAsset
  slug: {
    current: string
  }
}
