type SanityPage = {
  _type: string
  _updatedAt: string
  _createdAt: string
  title: string
  slug: {
    current: string
  }
  isEnabled: boolean
  metadata: SanityMetadata
  blogPostData?: SanityBlogPostData
  caseStudyData?: SanityCaseStudyData
  richTextContent?: SanityContentBlockProps[]
  sections?: SectionsSchema
}

type SanityPageWithLanguage = SanityPage & {
  language: string
}
