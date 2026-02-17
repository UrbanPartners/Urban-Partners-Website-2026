import { DEFAULT_LANGUAGE, DIRECTORY_NAMES, DOC_TYPES, HOME_SLUG, LANGUAGES } from '@/data'
import { getPage } from '@/data/sanity'
import { ResolvedMetadata } from 'next'
import { ResolvedOpenGraph } from 'next/dist/lib/metadata/types/opengraph-types'
import { sendGTMEvent } from '@next/third-parties/google'

import { getImageUrl } from '@/components/SanityImage/SanityImage.helper'

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || ''

export const wait = (ms = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const lerp = (currentValue: number, targetValue: number, ease = 0.1) => {
  return currentValue + (targetValue - currentValue) * ease
}

export const getMenuItemListingGroupId = (slug: string) => `id_${slug}`

export const setBodyCursor = (cursor: 'pointer' | 'drag' | 'dragging' | null) => {
  document.body.dataset.cursor = cursor || 'normal'
}

export const waitForWebfonts = (fonts: string[], callback: () => void) => {
  let loadedFonts = 0

  function loadFont(font: string) {
    let node: HTMLSpanElement | null = document.createElement('span')
    // Characters that vary significantly among different fonts
    node.innerHTML = 'giItT1WQy@!-/#'
    // Visible - so we can measure it - but not on the screen
    node.style.position = 'absolute'
    node.style.left = '-10000px'
    node.style.top = '-10000px'
    // Large font size makes even subtle changes obvious
    node.style.fontSize = '300px'
    // Reset any font properties
    node.style.fontFamily = 'sans-serif'
    node.style.fontVariant = 'normal'
    node.style.fontStyle = 'normal'
    node.style.fontWeight = 'normal'
    node.style.letterSpacing = '0'
    document.body.appendChild(node)

    // Remember width with no applied web font
    const width = node.offsetWidth

    node.style.fontFamily = font

    let interval: ReturnType<typeof setInterval> | null = null

    function checkFont() {
      // Compare current width with original width
      if (node && node.offsetWidth != width) {
        ++loadedFonts
        if (node.parentNode) {
          node.parentNode.removeChild(node)
        }

        node = null
      }

      // If all fonts have been loaded
      if (loadedFonts >= fonts.length) {
        if (interval) {
          clearInterval(interval)
        }
        if (loadedFonts == fonts.length) {
          callback()
          return true
        }
      }
    }

    if (!checkFont()) {
      interval = setInterval(checkFont, 50)
    }
  }

  for (let i = 0, l = fonts.length; i < l; ++i) {
    loadFont(fonts[i])
  }
}

export const getCssVar = (variable: string) => {
  return window.getComputedStyle(document.body).getPropertyValue(`--${variable}`)
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return { unit: 'Bytes', size: 0 }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return {
    size: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    unit: sizes[i],
  }
}

export const bytesToMb = (bytes: number) => {
  const { size, unit } = formatBytes(bytes)

  let value: number = size

  if (unit === 'KB') {
    value = value / 1024
  }

  return value
}

export const buildIdFromText = (input: string) => {
  return input
    .trim()
    .replace(/[^\w-\s+]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

export const generateMetadataReturn = ({
  title,
  description,
  shareImageUrl,
  parentData,
  allowCrawlers = true,
  themeColor = '#ffffff',
}: {
  title?: string
  description?: string
  shareImageUrl?: string
  allowCrawlers?: boolean
  parentData?: ResolvedMetadata
  themeColor?: string
}) => {
  const shareImagesParent = parentData?.openGraph?.images
  const imageChild = shareImagesParent?.length ? (shareImagesParent[0] as ResolvedOpenGraph) : null

  return {
    title: title || parentData?.title?.absolute,
    description: description || parentData?.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || ''),
    themeColor,
    manifest: '/manifest.webmanifest',
    openGraph: {
      title: title || parentData?.title?.absolute,
      description: description || parentData?.description,
      images: [`${shareImageUrl ? shareImageUrl : imageChild ? imageChild.url : shareImageUrl}`],
    },
    robots: {
      index: allowCrawlers,
      follow: allowCrawlers,
      nocache: !allowCrawlers,
      googleBot: {
        index: allowCrawlers,
        follow: allowCrawlers,
        noimageindex: !allowCrawlers,
      },
    },
  }
}

export const mergeSiteSettings = (pageData: SanityPage, settingsMetaData: SanityMetadata | null) => {
  if (!settingsMetaData) return pageData

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ignoreNulls: any = {}
  if (pageData?.metadata) {
    Object.keys(pageData?.metadata).forEach(key => {
      if (pageData?.metadata[key as keyof SanityMetadata] !== null) {
        if (key === 'image' && !pageData?.metadata?.image?.asset?._id) return
        ignoreNulls[key as keyof SanityMetadata] = pageData?.metadata[key as keyof SanityMetadata]
      }
    })
  }

  const merged: SanityMetadata = {
    image: settingsMetaData.image,
    favicon: settingsMetaData.favicon,
    metaBackgroundColorHex: settingsMetaData.metaBackgroundColorHex,
    themeColorHex: settingsMetaData.themeColorHex,
    ...ignoreNulls,
    defaultSiteKeywords: settingsMetaData.keywords,
    defaultSiteTitle: settingsMetaData.title,
    defaultSiteDescription: settingsMetaData.description,
  }

  pageData.metadata = merged

  return pageData
}

export const slugArrayToSlug = (slug: string | string[]): string => {
  if (!slug) return slug

  // NEEDS TO BE DECODED
  // Because vercel specifically needs this.
  // NO fricken idea why.
  if (typeof slug === 'string') {
    // Decode URL-encoded string
    return decodeURIComponent(slug)
  }

  return decodeURIComponent(slug.join('/'))
}

export const slugPathToSlugArray = (slug: string): string[] => {
  return slug.split('/')
}

export const removeLeadingSlash = (str: string): string => {
  return str.charAt(0) === '/' ? str.slice(1) : str
}

export const getPagePathBySlug = (slug: string) => {
  let locationKey: string | null = null
  Object.values(LANGUAGES).forEach(location => {
    if (HOME_SLUG === slug) {
      locationKey = location
    }
  })

  if (locationKey) {
    return `/${locationKey}`
  }

  return `/${slug}`
}

export const getBlogPostPathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.BLOG_POSTS}/${slug}`
}

export const getCaseStudyPathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.CASE_STUDIES}/${slug}`
}

export const getUrlFromPageData = (pageType: string, slug: string | string[]): string => {
  let url = ''

  if (Array.isArray(slug)) {
    slug = slug.join('/')
  }

  switch (pageType) {
    case DOC_TYPES.PAGE:
      url = getPagePathBySlug(slug)
      break
    case DOC_TYPES.BLOG_POST:
      url = getBlogPostPathBySlug(slug)
      break
    case DOC_TYPES.CASE_STUDY:
      url = getCaseStudyPathBySlug(slug)
      break
    default:
      break
  }

  return url
}

export const generateOrgStructuredDataSchema = ({
  companyTitle,
  companyDescription,
  image,
  addressInfo,
  telephone,
  foundingDate,
  numberOfEmployees,
  email,
  otherLinks,
}: SanityOrgStructuredData) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: companyTitle,
    description: companyDescription,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: image.asset.url,
    foundingDate: foundingDate,
    address: {
      '@type': 'PostalAddress',
      streetAddress: addressInfo.streetAddress,
      addressLocality: addressInfo.locality,
      addressRegion: addressInfo.region,
      postalCode: addressInfo.postalCode,
      addressCountry: addressInfo.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `[+${telephone}]`,
      email: email,
    },
    numberOfEmployees,
    sameAs: otherLinks,
  }

  return JSON.stringify(data)
}

export const getDeviceInfo = () => {
  const isBrowser = typeof window !== 'undefined'

  /* eslint-disable */
  const detect = {
    device: {},
    browser: {},
    os: {},
    bots: {},
    isTouchDevice: isBrowser && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
  } as {
    device: any
    browser: any
    os: any
    bots: any
    isTouchDevice: boolean
  }

  if (isBrowser) {
    detect.device = require('@jam3/detect').device
    detect.browser = require('@jam3/detect').browser
    detect.os = require('@jam3/detect').os
    detect.bots = require('@jam3/detect').bots
  }

  /* eslint-disable */

  return detect
}

export const deviceInfo = getDeviceInfo()

export const simpleImagesPreload = ({
  urls,
  onComplete,
  onProgress,
}: {
  urls: string[]
  onComplete?: () => void
  onProgress?: (percent: number, url: string) => void
}) => {
  let loadedCounter = 0
  const toBeLoadedNumber = urls.length

  urls.forEach(function (url) {
    preloadImage(url, function () {
      loadedCounter++
      if (onProgress) {
        onProgress(loadedCounter / toBeLoadedNumber, url)
      }
      if (loadedCounter === toBeLoadedNumber) {
        if (onComplete) onComplete()
      }
    })
  })

  function preloadImage(url: string, anImageLoadedCallback: () => void) {
    const img = new Image()
    img.onload = anImageLoadedCallback
    img.src = url
  }
}

export const formatMetadata = (
  metadata: SanityMetadata | null | undefined,
  pageData?: SanityPage | null,
  language: string = DEFAULT_LANGUAGE,
) => {
  if (!metadata || !metadata.image || !metadata.favicon) return {}

  // Title
  let pageTitle = metadata.title || pageData?.title

  let title = pageTitle

  if (metadata.defaultSiteTitle) {
    title = `${pageTitle} | ${metadata.defaultSiteTitle}`
  }

  if (pageTitle === metadata.defaultSiteTitle) {
    title = metadata.defaultSiteTitle || ''
  }

  // Description
  let description = metadata.defaultSiteDescription
  if (metadata.description) {
    description = metadata.description
  }

  // Keywords
  let keywords = metadata.defaultSiteKeywords
  if (metadata.keywords) {
    keywords = metadata.keywords
  }

  const data: any = {
    title,
    robots: {
      index: metadata.allowCrawlers,
      follow: metadata.allowCrawlers,
      nocache: !metadata.allowCrawlers,
      googleBot: {
        index: metadata.allowCrawlers,
        follow: metadata.allowCrawlers,
        noimageindex: !metadata.allowCrawlers,
      },
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || ''),
    description,
    keywords: keywords?.split(','),
    openGraph: {
      title,
      description,
      siteName: metadata.defaultSiteTitle,
      images: [
        {
          url: getImageUrl(metadata.image, {
            width: 1200,
            height: 630,
            fit: 'crop',
          }),
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: getImageUrl(metadata.image, {
            width: 1024,
            height: 512,
            fit: 'crop',
          }),
          width: 1024,
          height: 512,
          alt: metadata.title,
        },
      ],
    },
  }

  return data
}

export const getFormattedMetadata = async (slug: string, docType: string, isDraftMode: boolean, language: string) => {
  const data = await getPage(slug, docType, isDraftMode, language)
  const metadata = data?.metadata

  return formatMetadata(metadata, data as SanityPage, language)
}

export const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
export const ID_LENGTH = 10
export const createRandomString = (length = ID_LENGTH) => {
  const chars = CHARS
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const getSections = (data: SanityPage, language: string) => {
  if (data._type === DOC_TYPES.PAGE) {
    return data.sections
  }

  if (data._type === DOC_TYPES.BLOG_POST) {
    const newSections: any[] = []

    if (data._type === DOC_TYPES.BLOG_POST) {
      const blogPostRichText = {
        _type: 'richTextSection',
        content: data.richTextContent,
      }

      newSections.push(blogPostRichText)
    }

    if (!newSections.length) return data.sections

    const sections: SectionsSchema = [...newSections]

    if (data?.sections?.length) {
      data?.sections.forEach(section => {
        sections.push(section)
      })
    }

    const filteredSections = sections.filter(section => section._type)

    return filteredSections
  }

  return data.sections
}

export const setCookie = ({ name, value, maxAge }: { name: string; value: string; maxAge: number }) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge};`
}

export const getCookie = (name: string) => {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
  return null
}

export const deleteCookie = (name: string) => {
  setCookie({ name, value: '', maxAge: 0 })
}

export const replaceTextStringWithVars = (textString: string, variables: any) => {
  Object.keys(variables).forEach(variable => {
    textString = textString.replaceAll(`#{${variable}}`, variables[variable])
  })
  return textString
}

export const getFormattedDateString = (dateString: string) => {
  const dateObject = new Date(dateString)
  const date = new Date(dateObject)
  date.setDate(date.getDate() + 1)
  date.setHours(0, 0, 0, 0)
  const day = date.getDate()
  const year = date.getFullYear()
  const month = date.toLocaleString('default', { month: 'long' })

  return `${month} ${day}, ${year}`
}

export const sendEvent = (event: string, value: string) => {
  if (typeof window !== 'undefined' && GTM_ID) {
    sendGTMEvent({ event, value })
  }
}

export const formatDateToDDMMYYYY = (isoString: string): string => {
  const date = new Date(isoString)

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)

  return `${day}.${month}.${year}`
}

export function getReadingTime(text: string): number {
  // Average adult reading speed ~200 words per minute
  const wordsPerMinute = 200

  const wordCount = text.trim().split(/\s+/).length
  const rawMinutes = wordCount / wordsPerMinute

  // Convert to actual minutes (rounded up to next bucket)
  const buckets = [1, 2, 5, 7, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]

  // Find first bucket greater than or equal to the raw estimate
  const rounded = buckets.find(b => rawMinutes <= b)

  // If exceeds all buckets, cap at 60
  return rounded ?? 60
}

export function portableTextToText(blocks: any, opts = {}) {
  const options = Object.assign({}, { nonTextBehavior: 'remove' }, opts)
  return (
    blocks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((block: any) => {
        if (block._type !== 'block' || !block.children) {
          return options.nonTextBehavior === 'remove' ? '' : `[${block._type} block]`
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return block.children.map((child: any) => child.text).join('')
      })
      .join('\n\n')
  )
}

export interface TimeObject {
  hours: number
  minutes: number
  seconds: number
}

export const padNumber = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const secondsToTimeObject = (totalSeconds: number, addPadding = false): any => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  return {
    hours: addPadding ? padNumber(hours) : hours,
    minutes: addPadding ? padNumber(minutes) : minutes,
    seconds: addPadding ? padNumber(seconds) : seconds,
  }
}

export const toCapitalizeCase = (str: string): string => {
  if (!str) return ''

  // Split the string at capital letters, but keep the capital letters
  const words = str
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(/\s+/)
    .map(word => {
      const lowercased = word.toLowerCase()
      return lowercased.charAt(0).toUpperCase() + lowercased.slice(1)
    })

  return words.join(' ')
}

export const onScreenDebugger = (debuggingText: string, append = false) => {
  if (typeof window === 'undefined') return
  // if (process.env.NODE_ENV !== 'development') return

  let debuggerElement = document.getElementById('onScreenDebugger')

  // Create element if it doesn't exist
  if (!debuggerElement) {
    debuggerElement = document.createElement('div')
    debuggerElement.id = 'onScreenDebugger'
    document.body.appendChild(debuggerElement)
  }

  // Insert or append text
  if (append) {
    const innerHtml = window.onScreenDebuggerContent
    debuggerElement.innerHTML = `${debuggingText}\n${innerHtml}`
  } else {
    debuggerElement.innerHTML = debuggingText
  }

  window.onScreenDebuggerContent = debuggerElement.innerHTML
}
