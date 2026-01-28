export type SanityImage = {
  _key?: string
  // TODO: find a way to not have "type" & "mediaType" since their are kinda doing the same thing
  // Used for Graphic to differenciate svg / image
  _type: 'imageAsset'
  alt: string
  crop: {
    _type?: string
    left: number
    bottom: number
    right: number
    top: number
  }
  hotspot: {
    _type?: string
    width: number
    height: number
    x: number
    y: number
  }
  // Used for Media to differenciate video / image
  mediaType: 'image'
  asset: {
    _id: string
    height: number
    width: number
    aspectRatio: number
  }
}

export type ImageColumns = (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12) | string

export type ImageSize = ImageColumns | string

export type ImageColumnsByBreakpoint = {
  xs?: ImageSize
  mobile?: ImageSize
  tablet?: ImageSize
  laptop?: ImageSize
  desktop?: ImageSize
  xl?: ImageSize
}

export type ImageAspectRatio = number

export type ImageAspectRatioByBreakpoint = {
  xs?: ImageAspectRatio
  mobile?: ImageAspectRatio
  tablet?: ImageAspectRatio
  laptop?: ImageAspectRatio
  desktop?: ImageAspectRatio
  xl?: ImageAspectRatio
}

export type ImageProps = {
  className?: string
  source: SanityImage | string
  animated?: boolean
  columns?: ImageColumnsByBreakpoint | ImageColumns
  onReady?: ($element: HTMLImageElement) => void
  contain?: boolean
  blur?: number
  dpr?: number
  preload?: boolean
  quality?: number
  width?: number
  height?: number
  aspectRatio?: ImageAspectRatio | ImageAspectRatioByBreakpoint
  isCover?: boolean
  alt?: string
}

export type ImageBuilderOptions = {
  width: number
  height: number
  quality?: number
  fit?: string | null
  blur?: number
  dpr?: number
  isCover?: boolean
  format?: 'jpg' | 'pjpg' | 'png' | 'webp'
}
