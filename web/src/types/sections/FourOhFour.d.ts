type SanityFourOhFour = SectionCMSInterface & {
  mediaType: 'image' | 'video'
  videoLoopDesktop?: SanityVideoAsset
  videoLoopMobile?: SanityVideoAsset
  image?: SanityImage
}
