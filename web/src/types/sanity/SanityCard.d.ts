type SanityCard = {
  _type: 'blogPost' | 'caseStudy'
  title: string
  image?: SanityImage
  description?: string
  slug: string
  publishedDate?: string
}
