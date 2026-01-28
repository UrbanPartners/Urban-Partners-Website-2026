type SanityFeaturedArticle = SectionCMSInterface & {
  linksTo: SanityLink
  title: string
  variant: 'a' | 'b'
  description: string
  image?: SanityImage
}
