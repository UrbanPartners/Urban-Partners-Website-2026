type SanityPerson = {
  firstName: string
  lastName?: string
  fullName: string
  designation?: string
  designation2?: string
  linkedInUrl?: string
  email?: string
  phoneNumber?: string
  location?: string
  image?: SanityImageAsset
  bioSummary?: SanityContentBlockProps[]
  bio?: SanityContentBlockProps[]
  slug: {
    current: string
  }
}
