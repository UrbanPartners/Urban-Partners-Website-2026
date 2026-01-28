type SanityFactListItem = {
  _key: string
  title: string
  description: string
}

type SanityFactList = SectionCMSInterface & {
  title?: string
  description?: SanityContentBlockProps[]
  items?: SanityFactListItem[]
}
