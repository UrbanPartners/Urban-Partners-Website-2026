type SanityItemListItem = {
  _key: string
  title: string
  description?: SanityContentBlockProps[]
}

type SanityItemList = {
  _key: string
  _type: string
  title?: string
  items?: SanityItemListItem[]
}
