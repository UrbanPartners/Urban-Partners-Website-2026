import {DocumentActionProps, DocumentActionsContext} from 'sanity'
import {EyeOpenIcon} from '@sanity/icons'

// Doc Types
export const DOC_TYPES = {
  PAGE: 'page',
  RECIPE: 'recipe',
  ARTICLE: 'article',
  PRODUCT: 'product',
  TV_EPISODE: 'tvEpisode',
  RADIO_EPISODE: 'radioEpisode',
  MAGAZINE: 'magazineIssue',
  PAGE_SECTION_EXAMPLE: 'pageSectionExample',
  TOUR: 'tour',
  SERIES: 'series',
  SHOPIFY_PRODUCT: 'shopifyProduct',
  SHOPIFY_PRODUCT_VARIANT: 'shopifyProductVariant',
  SHOPIFY_COLLECTION: 'shopifyCollection',
  COLLECTION: 'collection',
  PERSON: 'person',
  CATEGORY: 'category',
  SUBCATEGORY: 'subcategory',
  SITE_SETTINGS: 'siteSettings',
  DIGITAL_MEDIA_ITEM: 'digitalMediaItem',
  ACCESS_TOKEN: 'accessToken',
  CLASS_COUPON: 'classCoupon',
}

export const DIRECTORY_NAMES = {
  PRODUCTS: 'products',
  RECIPES: 'recipes',
  TV: 'tv',
  RADIO: 'radio',
  PAGE_SECTION_EXAMPLE: 'page-sections',
  TOURS: 'tours',
  MAGAZINE: 'magazine',
  ARTICLE: 'stories',
  PERSON: 'authors',
  SERIES: 'series',
  DIGITAL_MEDIA_ITEM: 'digital-library',
  COLLECTIONS: 'collections',
}

export const EDITORS_NOTE_TYPE = 'editorsNote'

// Slugs / Paths
export const HOME_SLUG = 'home'
export const FOUR_OH_FOUR_SLUG = '404'
export const EDITORS_NOTE_PAGE_SLUG = 'editors-note'
export const LOGIN_SLUG = 'login'
export const ACCOUNT_SLUG = 'account'

export const getPagePathBySlug = (slug: string) => {
  if (slug === HOME_SLUG) return '/'
  return `/${slug}`
}

export const getRecipePathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.RECIPES}/${slug}`
}

export const getArticlePathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.ARTICLE}/${slug}`
}

export const getTvEpisodePathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.TV}/${slug}`
}

export const getRadioEpisodePathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.RADIO}/${slug}`
}

export const getMagazineIssuePathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.MAGAZINE}/${slug}`
}

export const getEditorsNotePathBySlug = (slug: string) => {
  // Slug should include the slug of the magazine issue
  return `/${DIRECTORY_NAMES.MAGAZINE}/${slug}/editors-note`
}

export const getPageSectionExamplePathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.PAGE_SECTION_EXAMPLE}/${slug}`
}

export const getCollectionPathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.COLLECTIONS}/${slug}`
}

export const getPersonPathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.PERSON}/${slug}`
}

export const getTourPathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.TOURS}/${slug}`
}

export const getSeriesPathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.SERIES}/${slug}`
}

export const getDigitalMediaItemPathBySlug = (slug: string) => {
  return `/${DIRECTORY_NAMES.DIGITAL_MEDIA_ITEM}/${slug}`
}

export const getUrlFromPageData = (pageType: string, slug: string): string => {
  let url = ''

  switch (pageType) {
    case DOC_TYPES.PAGE:
      url = getPagePathBySlug(slug)
      break
    case DOC_TYPES.RECIPE:
      url = getRecipePathBySlug(slug)
      break
    case DOC_TYPES.ARTICLE:
      url = getArticlePathBySlug(slug)
      break
    case DOC_TYPES.TV_EPISODE:
      url = getTvEpisodePathBySlug(slug)
      break
    case DOC_TYPES.RADIO_EPISODE:
      url = getRadioEpisodePathBySlug(slug)
      break
    case DOC_TYPES.MAGAZINE:
      url = getMagazineIssuePathBySlug(slug)
      break
    case EDITORS_NOTE_TYPE:
      url = getEditorsNotePathBySlug(slug)
      break
    case DOC_TYPES.PAGE_SECTION_EXAMPLE:
      url = getPageSectionExamplePathBySlug(slug)
      break
    case DOC_TYPES.PERSON:
      url = getPersonPathBySlug(slug)
      break
    case DOC_TYPES.TOUR:
      url = getTourPathBySlug(slug)
      break
    case DOC_TYPES.SERIES:
      url = getSeriesPathBySlug(slug)
      break
    case DOC_TYPES.DIGITAL_MEDIA_ITEM:
      url = getDigitalMediaItemPathBySlug(slug)
      break
    case DOC_TYPES.COLLECTION:
      url = getCollectionPathBySlug(slug)
      break
    default:
      break
  }

  return url
}

const previewAction = (context: DocumentActionsContext) => {
  return (props: DocumentActionProps) => {
    const {draft, published} = props
    const doc: any = draft || published

    let linkPath = null
    if (doc) {
      linkPath = getUrlFromPageData(doc._type, doc.slug?.current)
    }

    if (!linkPath) {
      return null
    }

    if (!process.env.SANITY_STUDIO_FRONTEND_URL) {
      console.warn('SANITY_STUDIO_FRONTEND_URL is not set')
      return null
    }

    // // Only show the preview button for specific document types
    // if (!doc || doc._type !== 'article' /* or whatever your type is */) {
    //   return null
    // }

    // const previewUrl = `https://your-site.com/preview/${doc?.slug?.current}`

    return {
      label: 'Preview',
      icon: EyeOpenIcon,
      onHandle: () => {
        window.open(`${process.env.SANITY_STUDIO_FRONTEND_URL}${linkPath}`, '_blank')
      },
    }
  }
}

previewAction.displayName = 'PreviewAction'

export default previewAction
