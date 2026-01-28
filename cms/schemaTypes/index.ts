// Documents
import page from './documents/page'
import sharedSection from './documents/sharedSection'
import blogCategory from './documents/blogCategory'
import blogReference from './documents/blogReference'
import globalSettings from './documents/globalSettings'
import person from './documents/person'

// Objects
import cmsSettings from './objects/cmsSettings'
import imageAsset from './objects/imageAsset'
import link from './objects/link'
import metadata from './objects/metadata'
import orgStructuredData from './objects/orgStructuredData'
import video from './objects/video'
import videoPlayer from './objects/videoPlayer'
import mediaAsset from './objects/mediaAsset'
import itemList from './objects/itemList'
import button from './objects/button'
import richTextBlockquote from './objects/richTextBlockquote'
import vimeoData from './objects/vimeoData'
import customCard from './objects/customCard'

// Sections
/* INJECT_OBJECT_DEFINITION */
import basicAccordion from './sections/basicAccordion'
import ourStoryScroller from './sections/ourStoryScroller'
import newsList from './sections/newsList'
import featuredArticle from './sections/featuredArticle'
import newsSearchAndTitle from './sections/newsSearchAndTitle'
import infoTiles from './sections/infoTiles'
import peopleAccordion from './sections/peopleAccordion'
import textTiles from './sections/textTiles'
import textBlockWithImage from './sections/textBlockWithImage'
import pagePromo from './sections/pagePromo'
import textBlocksWithImageSwapper from './sections/textBlocksWithImageSwapper'
import textAccordion from './sections/textAccordion'
import imageAndTextAccordion from './sections/imageAndTextAccordion'
import largeTitleHeroWithMedia from './sections/largeTitleHeroWithMedia'
import textTickerSection from './sections/textTickerSection'
import expandingImageAndContent from './sections/expandingImageAndContent'
import gridContent from './sections/gridContent'
import numberAndText from './sections/numberAndText'
import homeHero from './sections/homeHero'
import factList from './sections/factList'
import expandingCarousel from './sections/expandingCarousel'
import introText from './sections/introText'
import imageBlocks from './sections/imageBlocks'
import quote from './sections/quote'
import bigMedia from './sections/bigMedia'
import blogPostHero from './sections/blogPostHero'
import spacer from './sections/spacer'
import richTextSection from './sections/richTextSection'
import fourOhFour from './sections/fourOhFour'
import testComponent from './sections/testComponent'

export const schemaTypes = [
  // Objects
  cmsSettings,
  link.link,
  link.linkNoLabel,
  link.linkNoDisabled,
  link.linkNoDisabledNoLabel,
  video,
  videoPlayer,
  imageAsset,
  mediaAsset,
  metadata.siteSettingsMetadata,
  metadata.pageMetadata,
  orgStructuredData,
  itemList,
  button,
  richTextBlockquote,
  vimeoData,
  customCard,

  // Sections
  /* INJECT_OBJECT_TYPE */
  basicAccordion,
  ourStoryScroller,
  newsList,
  featuredArticle,
  newsSearchAndTitle,
  infoTiles,
  peopleAccordion,
  textTiles,
  textBlockWithImage,
  pagePromo,
  textBlocksWithImageSwapper,
  textAccordion,
  imageAndTextAccordion,
  largeTitleHeroWithMedia,
  textTickerSection,
  expandingImageAndContent,
  gridContent,
  numberAndText,
  homeHero,
  factList,
  expandingCarousel,
  introText,
  imageBlocks,
  quote,
  bigMedia,
  blogPostHero,
  spacer,
  richTextSection,
  fourOhFour,
  testComponent,

  // Documents
  person,
  blogCategory,
  blogReference,
  page.page,
  page.blogPost,
  page.caseStudy,
  sharedSection,
  globalSettings,
]
