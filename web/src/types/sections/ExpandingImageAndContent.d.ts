type SanityExpandingImageAndContentItem = {
  _key: string
  title: string
  description?: SanityContentBlockProps[]
  cta: SanityLink
  itemList?: SanityItemList
  media: SanityMediaAsset
}

type SanityExpandingImageAndContent = SectionCMSInterface & {
  items?: SanityExpandingImageAndContentItem[]
}
