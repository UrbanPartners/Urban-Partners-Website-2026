type SanityInfoTilesItem = {
  _key: string
  title: string
  titleSubheader?: string
  description?: SanityContentBlockProps[]
  bottomLinks?: SanityLink[]
}

type SanityInfoTiles = SectionCMSInterface & {
  tallerContent?: boolean
  items: SanityInfoTilesItem[]
}
