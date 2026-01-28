type SanityBasicAccordionItem = {
  _key: string
  title: string
  description?: SanityContentBlockProps[]
}

type SanityBasicAccordion = SectionCMSInterface & {
  title?: string
  items: SanityBasicAccordionItem[]
}
