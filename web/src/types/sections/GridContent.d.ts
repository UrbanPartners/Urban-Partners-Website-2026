type SanityGridContentItem = {
  _key: string
  content?: SanityContentBlockProps[]
}

type SanityGridContent = SectionCMSInterface & {
  firstRowColumns: 2 | 3
  caption?: string
  items?: SanityGridContentItem[]
}
