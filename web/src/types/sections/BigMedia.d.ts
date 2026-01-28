type SanityBigMedia = SectionCMSInterface & {
  size: 'full' | '3/4'
  height: 'default' | 'tall' | 'customAspectRatio'
  customAspectRatio?: string
  position: 'right' | 'left'
  mediaAsset: SanityMediaAsset
}
