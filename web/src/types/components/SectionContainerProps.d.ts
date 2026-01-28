type SectionContainerProps = {
  _type: string
  children: ReactNode
  pageIsActive?: boolean
  cmsTitle: string
  sectionsLength: number
  nextSectionType?: string
  sectionIndex: number
  spacerSettings?: {
    bottomDesktop: null | string
    bottomMobile: null | string
    topDesktop: null | string
    topMobile: null | string
  }
  isLastSection?: boolean
  id?: string
  zIndex?: string
}
