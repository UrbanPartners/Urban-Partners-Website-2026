type SanityHomeHero = SectionCMSInterface & {
  title: string
  titleMobile: string
  media: SanityMediaAsset
  backgroundOverlay?: number
  descriptionTitle?: SanityContentBlockProps[]
  descriptionText?: SanityContentBlockProps[]
}
