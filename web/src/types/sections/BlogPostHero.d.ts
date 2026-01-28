type SanityBlogPostHero = SectionCMSInterface & {
  title: string
  summary?: string
  blogCategories: SanityBlogCategory[]
  author?: SanityPerson
  date?: string
  readingTime?: number
  isCaseStudy?: boolean
}
