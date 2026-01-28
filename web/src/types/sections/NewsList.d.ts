type SanityNewsListItem = {
  _id: string
  _type: 'blogPost'
  title: string
  slug: string
  image?: SanityImage
  publishedDate?: string
  description?: string
}

type SanityNewsList = SectionCMSInterface & {
  variant: 'a' | 'b'
  title: string
  offsetPosts: boolean
  totalItems: number
  items: SanityNewsListItem[]
}
