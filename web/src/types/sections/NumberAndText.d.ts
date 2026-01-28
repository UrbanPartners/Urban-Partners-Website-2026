type SanityNumberAndText = SectionCMSInterface & {
  number: string
  description?: SanityContentBlockProps[]
  subheading?: string
  subheadingDescription?: SanityContentBlockProps[]
  cta?: SanityButton
}
