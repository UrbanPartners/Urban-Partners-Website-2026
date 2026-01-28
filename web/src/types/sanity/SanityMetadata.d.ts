type SanityMetadata = {
  _key: string
  _type: string
  title?: string
  description?: string
  keywords?: string
  allowCrawlers?: boolean
  image?: SanityImage
  favicon?: SanityImage
  metaBackgroundColorHex?: string
  themeColorHex?: string
  defaultSiteTitle?: string
  defaultSiteDescription?: string
  defaultSiteKeywords?: string
}
