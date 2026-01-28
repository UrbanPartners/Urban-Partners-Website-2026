type SanityMediaAsset = (SanityImage | SanityVideo) & {
  _type: 'imageAsset' | 'video'
}
