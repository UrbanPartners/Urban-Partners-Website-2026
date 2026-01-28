type SanityPeopleAccordionItem = {
  _key: string
  title: string
  description: SanityContentBlockProps[]
  people: SanityPerson[]
}

type SanityPeopleAccordion = SectionCMSInterface & {
  items: SanityPeopleAccordionItem[]
}
