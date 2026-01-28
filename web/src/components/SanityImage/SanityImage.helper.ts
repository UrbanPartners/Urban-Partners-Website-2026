import imageUrlBuilder from '@sanity/image-url'
import styles from '@/styles/export-vars.module.scss'

/*
TODO: make breakpoints universal variable
*/

import { ImageBuilderOptions, SanityImage } from '@/types/sanity/SanityImage'
const { mobile, tablet, laptop, desktop, xl } = styles

// Constants
const DEFAULT_QUALITY = 80
const DEFAULT_COLUMN = 12
const MAX_GRID_WIDTH = 1440

const BREAKPOINTS_AS_NUMBERS = {
  mobile: parseInt(mobile),
  tablet: parseInt(tablet),
  laptop: parseInt(laptop),
  desktop: parseInt(desktop),
  xl: parseInt(xl),
}

const _breakpoints = /** @type {const} */ [
  {
    name: 'xs',
    min: 0,
  },
  {
    name: 'mobile',
    min: BREAKPOINTS_AS_NUMBERS.mobile,
  },
  {
    name: 'tablet',
    min: BREAKPOINTS_AS_NUMBERS.tablet,
  },
  {
    name: 'laptop',
    min: BREAKPOINTS_AS_NUMBERS.laptop,
  },
  {
    name: 'desktop',
    min: BREAKPOINTS_AS_NUMBERS.desktop,
  },
  {
    name: 'xl',
    min: BREAKPOINTS_AS_NUMBERS.xl,
  },
]

_breakpoints.sort((a, b) => (a.min === null ? 1 : b === null ? -1 : a.min - b.min))

const _BREAKPOINTS: {
  [key: string]: number
} = {}

_breakpoints.forEach(breakpoint => {
  _BREAKPOINTS[breakpoint.name] = breakpoint.min === 0 ? 1 : breakpoint.min
})

export const BREAKPOINTS = _BREAKPOINTS

export const breakpoints = _breakpoints

export const IMAGE_SRC_SET_WIDTHS = [
  // Default imageSizes: 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840,
  256, 750, 1200, 1920, 2600,
]

export const columnToVw = (column: number | string = DEFAULT_COLUMN): string => {
  if (typeof column === 'string') return column
  const isFullWidth = column === DEFAULT_COLUMN
  // The max grid width is 1440px, we want to ensure that the image never exceeds this width
  // This not being used on full width images
  const maxWidth = MAX_GRID_WIDTH * (column / DEFAULT_COLUMN)
  if (isFullWidth) {
    return `${Math.ceil((column / DEFAULT_COLUMN) * 100)}vw`
  } else {
    return `min(${Math.ceil((column / DEFAULT_COLUMN) * 100)}vw, ${maxWidth}px)`
  }
}

// This is used specifically to remove native functionality of
// generating image srcSet within _next/ directory which is
// then served from Vercel, and to instead request all images
// from the new CDN
export const imageLoader = ({ src, width }: { src: string; width: number }) => {
  const url = new URL(src)
  const originalHeight = parseInt(url.searchParams.get('h') || '0')
  const originalWidth = parseInt(url.searchParams.get('w') || '0')
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'max')
  url.searchParams.set('w', width.toString())

  if (originalHeight && originalWidth) {
    url.searchParams.set('h', `${Math.round((width * originalHeight) / originalWidth)}`)
  }

  return url.href
}

export const getImageUrl = (
  image: SanityImage,
  { width, height, quality = DEFAULT_QUALITY, blur, isCover, fit, format }: ImageBuilderOptions,
) => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  if (!projectId || !dataset) {
    console.error('Missing required Sanity environment variables')
    return ''
  }

  if (!image || !image.asset) {
    console.warn('Invalid image object provided')
    return ''
  }

  const builder = imageUrlBuilder({
    projectId,
    dataset,
  })
  const urlFor = builder.image(image)
  let srcObject = urlFor.width(width).height(height).quality(quality)
  if (format) {
    srcObject = srcObject.format(format)
  } else {
    srcObject = srcObject.auto('format')
  }

  const shouldCrop = isCover || fit === 'crop'

  if (shouldCrop && image?.crop) {
    srcObject = srcObject
      .fit('crop')
      .crop('focalpoint')
      .focalPoint(image.hotspot?.x || 0.5, image.hotspot?.y || 0.5)
  }
  if (blur) {
    srcObject = srcObject.blur(blur)
  }
  if (image?.crop && image?.asset?.width && image?.asset?.height) {
    const cropWidthPercent = 1 - image.crop.left - image.crop.right
    const croppedWidth = Math.round(image.asset.width * cropWidthPercent)
    const cropHeightPercent = 1 - image.crop.top - image.crop.bottom
    const croppedHeight = Math.round(image.asset.height * cropHeightPercent)

    srcObject = srcObject.rect(
      Math.round(image.crop?.left * image.asset.width),
      Math.round(image.crop?.top * image.asset.height),
      croppedWidth,
      croppedHeight,
    )
  }

  const url = srcObject.url()

  return url
}
