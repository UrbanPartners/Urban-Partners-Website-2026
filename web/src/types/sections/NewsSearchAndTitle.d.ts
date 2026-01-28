type SanityNewsSearchAndTitle = SectionCMSInterface & {
  title: string
  hideDropdowns?: boolean
  blogCategories?: SanityBlogCategory[]
  blogReferences?: SanityBlogReference[]
}
