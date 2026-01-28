type SanityTextTickerSectionRow = {
  _key: string
  items: string[]
}

type SanityTextTickerSection = SectionCMSInterface & {
  title?: string
  rows: SanityTextTickerSectionRow[]
}
