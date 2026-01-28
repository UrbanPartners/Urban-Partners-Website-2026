import { groq } from 'next-sanity'
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
  'testComponent',
]

const fragmentsCopy: {
  // eslint-disable-next-line
  [key: string]: any
} = { ...fragments }

const sectionFields = ALL_SECTIONS.map(typeName => {
  if (fragmentsCopy[typeName as keyof typeof fragmentsCopy]) {
    return `_type == "${typeName}" => { ${fragmentsCopy[typeName as keyof typeof fragmentsCopy].fields} }\n`
  }
}).join(',')

const referenceFields = groq`
  _type == "sharedSection" => { 
    ...(@->) {
      ...section[][0] {
        ${sectionFields},
      }
    },
  }
`

const totalFieldsWithReferences = groq`
  ${sectionFields},
  ${referenceFields}
`

export const fields = totalFieldsWithReferences

const exported = {
  fields,
}

export default exported
