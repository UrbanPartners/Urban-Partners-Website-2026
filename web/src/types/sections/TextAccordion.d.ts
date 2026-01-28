type SanityTextAccordionItem = {
  _key: string
  title: string
  description?: SanityContentBlockProps[]
  itemList?: SanityItemList
}

type SanityTextAccordion = SectionCMSInterface & {
  items: SanityTextAccordionItem[]
}
