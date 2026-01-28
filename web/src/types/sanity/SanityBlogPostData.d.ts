type SanityBlogPostData = {
  image?: SanityImageAsset
  publishedDate?: string
  blogCategories: SanityBlogCategory[]
  blogReferences: SanityBlogReference[]
  summary?: string
  author?: SanityPerson
  disableFromNewsFeed?: boolean
}
