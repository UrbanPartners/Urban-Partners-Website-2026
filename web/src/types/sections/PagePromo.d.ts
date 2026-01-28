type SanityPagePromo = SectionCMSInterface & {
  title: string
  subtitle?: string
  description?: SanityContentBlockProps[]
  image?: SanityImage
  cta?: SanityButton
}
