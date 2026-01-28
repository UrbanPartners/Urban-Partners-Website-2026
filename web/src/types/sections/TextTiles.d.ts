type SanityTextTilesItem = {
  _key: string
  title: string
  description: SanityContentBlockProps[]
}

type SanityTextTiles = SectionCMSInterface & {
  itemsPerRow: '3' | '4'
  items: SanityTextTilesItem[]
}
