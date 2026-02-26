type SanityOurStoryScrollerIntroSectionCaseStudyItem = {
  _key: string
  title: string
  description: string
  image: SanityImage
  imageOverlayOpacity?: number
  cta: SanityLink
}

type SanityOurStoryScrollerIntroSection = {
  title: string
  subtitle: string
  description: SanityContentBlockProps[]
  caseStudyListDescription: SanityContentBlockProps[]
  caseStudyItems: SanityOurStoryScrollerIntroSectionCaseStudyItem[]
}

type SanityOurStoryScrollerTimelineSectionItem = {
  _key: string
  image: SanityImage
  title: string
  description: SanityContentBlockProps[]
  imageLayout: 'landscape' | 'portrait'
}

type SanityOurStoryScrollerTimelineSectionItemsByYear = {
  _key: string
  yearSuffix: string
  items: SanityOurStoryScrollerTimelineSectionItem[]
}

type SanityOurStoryScrollerTimelineSection = {
  yearPrefix: string
  subtitle: string
  itemsByYear: SanityOurStoryScrollerTimelineSectionItemsByYear[]
}

type SanityOurStoryScrollerLocationsSectionLocation = {
  _key: string
  title: string
  image: SanityImage
}

type SanityOurStoryScrollerLocationsSection = {
  title: string
  description: SanityContentBlockProps[]
  cta: SanityLink
  locations: SanityOurStoryScrollerLocationsSectionLocation[]
}

type SanityOurStoryScrollerMediaSection = {
  title: string
  description: string
  backgroundImage: SanityImage
  backgroundImageOverlay: number
  media?: SanityMedia
  cta: SanityLink
}

type SanityOurStoryScroller = SectionCMSInterface & {
  introSection?: SanityOurStoryScrollerIntroSection
  timelineSection?: SanityOurStoryScrollerTimelineSection
  locationsSection?: SanityOurStoryScrollerLocationsSection
  mediaSection?: SanityOurStoryScrollerMediaSection
}
