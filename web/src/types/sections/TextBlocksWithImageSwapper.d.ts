type SanityTextBlocksWithImageSwapperItem = {
  _key: string
  title: string
  description: SanityContentBlockProps[]
  image?: SanityImage
}

type SanityTextBlocksWithImageSwapper = SectionCMSInterface & {
  items: SanityTextBlocksWithImageSwapperItem[]
}
