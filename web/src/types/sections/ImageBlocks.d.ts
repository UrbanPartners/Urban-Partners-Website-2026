type SanityImageBlocks = SectionCMSInterface & {
  image1: SanityImage
  image2: SanityImage
  title?: string
  description?: SanityContentBlockProps[]
  flippedPosition?: boolean
}
