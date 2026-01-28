type SanityLargeTitleHeroWithMedia = SectionCMSInterface & {
  title: string
  subtitle?: string
  description?: SanityContentBlockProps[]
  mediaAsset?: SanityMediaAsset
  mediaSize?: 'full' | '3/4'
  mediaHeight?: 'default' | 'tall'
  showArrow?: boolean
}
