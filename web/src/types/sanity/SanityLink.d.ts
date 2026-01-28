type SanityLinkInternal = {
  _id?: string
  _type: string
  slug: string
}

type SanityLinkVideoTypes = 'vimeo' | 'youtube'

type SanityLink = {
  label?: string
  linkType: 'internal' | 'external' | 'disabled' | 'videoPopout' | 'file'
  link: SanityLinkInternal | string
  videoPopoutType?: SanityLinkVideoTypes
  videoId?: string
  hash?: string
  icon?: string
  navigationOffset?: bool
}
