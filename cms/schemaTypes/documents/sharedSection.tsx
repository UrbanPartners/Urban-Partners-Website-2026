import {Rule} from 'sanity'
// import SECTION_IMAGES from '../../utils/sectionImages'
// import {RenderSectionImage} from '../../components/RenderSectionImage'

export const sectionTypes: string[] = [
  'spacer',
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
  'richTextSection',
  'testComponent',
  'fourOhFour',
]

export default {
  name: 'sharedSection',
  type: 'document',
  title: 'Shared Section',
  fields: [
    {
      name: 'section',
      description: 'Select ONE section only.',
      title: 'Section',
      type: 'array',
      of: sectionTypes.map((type) => ({type})),
      validation: (Rule: Rule) => Rule.required().min(1).max(1),
    },
    // {
    //   name: 'exampleImageOfComponent',
    //   title: 'Example Image of Component:',
    //   type: 'string',
    //   components: {
    //     input: RenderSectionImage,
    //   },
    // },
  ],
  preview: {
    select: {
      section: 'section',
    },
    prepare({section}: {section: any[]}) {
      const sectionData = section[0]
      const title = `${sectionData?.cmsSettings?.cmsTitle || sectionData?._type}`
      const isHidden = sectionData?.cmsSettings?.isHidden
      const type = sectionData?._type
      const subtitle = type || ''

      return {
        title,
        subtitle: `${isHidden ? '⚪' : '🟢'} ${subtitle}`,
        // media: (
        //   <>
        //     {SECTION_IMAGES[type as keyof typeof SECTION_IMAGES] ? (
        //       <img src={SECTION_IMAGES[type as keyof typeof SECTION_IMAGES]} />
        //     ) : (
        //       <></>
        //     )}
        //   </>
        // ),
      }
    },
  },
}
