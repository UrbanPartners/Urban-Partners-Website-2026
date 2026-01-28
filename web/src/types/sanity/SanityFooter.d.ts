type SanityFooterLinkColumn = {
  title: string
  items: SanityLink[]
}

type SanityFooter = {
  title: string
  linkColumns: SanityFooterLinkColumn[]
  socialMediaLinks?: SanityLink[]
  legal: string
  allergenGuidePdf?: SanityVideoAsset
}
