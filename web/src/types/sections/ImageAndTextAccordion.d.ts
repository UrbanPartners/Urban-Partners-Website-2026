type SanityImageAndTextAccordionItem = {
  _key: string
  title: string
  image: SanityImage
  description?: SanityContentBlockProps[]
  bigNumber?: string
  bigNumberSubtitle?: string
  itemList?: SanityItemList
}

type SanityImageAndTextAccordion = SectionCMSInterface & {
  items: SanityImageAndTextAccordionItem[]
}
