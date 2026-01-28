import * as fragments from './sections/index'

const ALL_SECTIONS: string[] = [
  /* INJECT_TYPE */
  'basicAccordion',
  'ourStoryScroller',
  'newsList',
  'featuredArticle',
  'newsSearchAndTitle',
  'infoTiles',
  'peopleAccordion',
  'textTiles',
  'textBlockWithImage',
  'pagePromo',
  'textBlocksWithImageSwapper',
  'textAccordion',
  'imageAndTextAccordion',
  'largeTitleHeroWithMedia',
  'textTickerSection',
  'expandingImageAndContent',
  'gridContent',
  'numberAndText',
  'homeHero',
  'factList',
  'expandingCarousel',
  'introText',
  'imageBlocks',
  'quote',
  'bigMedia',
  'blogPostHero',
  'spacer',
  'richTextSection',
  'fourOhFour',
  'valuesList',
  'timeline',
  'richTextContent',
  'eventDetails',
  'contactForm',
  'accordionItemsWithSideNavigation',
  'guestServicesHero',
  'textAndImageHeroWithBreadcrumbs',
  'richTextHero',
  'ecommerceItemList',
  'contentCards',
  'giftCardGrid',
  'pressHighlightListing',
  'textAndAccordion',
  'giftCardIframe',
  'menuListing',
  'staggeredImages',
  'merchandiseShowcase',
  'emailSignup',
  'reviews',
  'homepageHero',
  'locationsList',
  'mediaBackgroundAndTitle',
  'stats',
  'threeUp',
  'testComponent',
  'textAndImage',
]

interface FragmentShape {
  fields: string
  fragment: () => string
}

const fragmentsCopy: {
  [key: string]: FragmentShape
} = { ...fragments }

export const getFields = () => {
  const sectionsToQuery = ALL_SECTIONS

  const sectionFields = sectionsToQuery
    .map(typeName => {
      if (fragmentsCopy[typeName as keyof typeof fragmentsCopy]) {
        return `_type == "${typeName}" => { ${fragmentsCopy[typeName as keyof typeof fragmentsCopy].fields} }\n`
      }
    })
    .join(',')

  return `
    _id,
    _ref,
    section[] {
      ${sectionFields}
    }
  `
}

/* eslint-disable */
export const fragment: (name: string) => string = (name = 'sections') => {
  return `${name}[] -> {
    ${getFields()}
    }`
}
/* eslint-enable */

const exported = {
  fragment,
  getFields,
}

export default exported
