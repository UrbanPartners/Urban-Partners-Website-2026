'use client'

import { Fragment, useLayoutEffect, type ElementType } from 'react'
import SectionContainer from '@/components/SectionContainer/SectionContainer'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { buildIdFromText, toCapitalizeCase } from '@/utils'
import Footer from '@/components/Footer/Footer'
import useStore from '@/store'
import styles from './Sections.module.scss'

/* INJECT_SECTIONS_IMPORT */
import BasicAccordion from '@/sections/BasicAccordion/BasicAccordion'
import OurStoryScroller from '@/sections/OurStoryScroller/OurStoryScroller'
import NewsList from '@/sections/NewsList/NewsList'
import FeaturedArticle from '@/sections/FeaturedArticle/FeaturedArticle'
import NewsSearchAndTitle from '@/sections/NewsSearchAndTitle/NewsSearchAndTitle'
import InfoTiles from '@/sections/InfoTiles/InfoTiles'
import PeopleAccordion from '@/sections/PeopleAccordion/PeopleAccordion'
import TextTiles from '@/sections/TextTiles/TextTiles'
import TextBlockWithImage from '@/sections/TextBlockWithImage/TextBlockWithImage'
import PagePromo from '@/sections/PagePromo/PagePromo'
import TextBlocksWithImageSwapper from '@/sections/TextBlocksWithImageSwapper/TextBlocksWithImageSwapper'
import TextAccordion from '@/sections/TextAccordion/TextAccordion'
import ImageAndTextAccordion from '@/sections/ImageAndTextAccordion/ImageAndTextAccordion'
import LargeTitleHeroWithMedia from '@/sections/LargeTitleHeroWithMedia/LargeTitleHeroWithMedia'
import TextTickerSection from '@/sections/TextTickerSection/TextTickerSection'
import ExpandingImageAndContent from '@/sections/ExpandingImageAndContent/ExpandingImageAndContent'
import GridContent from '@/sections/GridContent/GridContent'
import NumberAndText from '@/sections/NumberAndText/NumberAndText'
import HomeHero from '@/sections/HomeHero/HomeHero'
import FactList from '@/sections/FactList/FactList'
import ExpandingCarousel from '@/sections/ExpandingCarousel/ExpandingCarousel'
import IntroText from '@/sections/IntroText/IntroText'
import ImageBlocks from '@/sections/ImageBlocks/ImageBlocks'
import Quote from '@/sections/Quote/Quote'
import BigMedia from '@/sections/BigMedia/BigMedia'
import BlogPostHero from '@/sections/BlogPostHero/BlogPostHero'
import Spacer from '@/sections/Spacer/Spacer'
import RichTextSection from '@/sections/RichTextSection/RichTextSection'
import FourOhFour from '@/sections/FourOhFour/FourOhFour'
import TestComponent from '@/sections/TestComponent/TestComponent'

ScrollTrigger.config({
  ignoreMobileResize: true,
})

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({
  ignoreMobileResize: true,
})

const SECTIONS: {
  [key: string]: ElementType
} = {
  /* INJECT_SECTIONS_COMPONENT_TYPE */
  basicAccordion: BasicAccordion,
  ourStoryScroller: OurStoryScroller,
  newsList: NewsList,
  featuredArticle: FeaturedArticle,
  newsSearchAndTitle: NewsSearchAndTitle,
  infoTiles: InfoTiles,
  peopleAccordion: PeopleAccordion,
  textTiles: TextTiles,
  textBlockWithImage: TextBlockWithImage,
  pagePromo: PagePromo,
  textBlocksWithImageSwapper: TextBlocksWithImageSwapper,
  textAccordion: TextAccordion,
  imageAndTextAccordion: ImageAndTextAccordion,
  largeTitleHeroWithMedia: LargeTitleHeroWithMedia,
  textTickerSection: TextTickerSection,
  expandingImageAndContent: ExpandingImageAndContent,
  gridContent: GridContent,
  numberAndText: NumberAndText,
  homeHero: HomeHero,
  factList: FactList,
  expandingCarousel: ExpandingCarousel,
  introText: IntroText,
  imageBlocks: ImageBlocks,
  quote: Quote,
  bigMedia: BigMedia,
  blogPostHero: BlogPostHero,
  spacer: Spacer,
  richTextSection: RichTextSection,
  fourOhFour: FourOhFour,
  testComponent: TestComponent,
}

function Sections({ sections }: SectionsProps) {
  const setFirstSectionType = useStore(store => store.setFirstSectionType)
  const cmsDebug = useStore(state => state.cmsDebug)

  useLayoutEffect(() => {
    if (sections?.length) {
      const firstSection = sections[0]
      if (firstSection?._type) {
        setFirstSectionType(firstSection?._type)
      }
    }
  }, [sections, setFirstSectionType])

  if (!sections?.length) return null

  return (
    <>
      {sections.map((section, i) => {
        if (!section) {
          console.warn('No section tied to data ', section)
          return null
        }

        const nextSectionObj = sections[i + 1]
        const sectionObj = section

        if (!sectionObj._type) {
          return null
        }

        if (!SECTIONS[sectionObj._type]) {
          console.warn('No section found with type ', sectionObj._type)
          return null
        }

        if (sectionObj?.cmsSettings?.isHidden) {
          return null
        }

        const SectionComponent = SECTIONS[sectionObj._type]

        /* eslint-disable */
        const nextSectionType = (nextSectionObj as any)?._type || undefined
        /* eslint-enable */

        let hasSpacerSettings = false
        if (sectionObj?.spacerSettings) {
          if (Object.entries(sectionObj?.spacerSettings as Record<string, string>)?.length) {
            hasSpacerSettings = true
          }
        }

        return (
          <Fragment key={`${i}_${sectionObj._id}_${buildIdFromText(sectionObj?.cmsSettings?.cmsTitle || '')}`}>
            <SectionContainer
              cmsTitle={sectionObj?.cmsSettings?.cmsTitle || ''}
              _type={sectionObj._type}
              sectionsLength={sections.length}
              nextSectionType={nextSectionType}
              sectionIndex={i}
              spacerSettings={sectionObj?.spacerSettings}
              isLastSection={i === sections.length - 1}
              id={sectionObj?.cmsSettings?.id}
              zIndex={sectionObj?.cmsSettings?.zIndex}
            >
              {cmsDebug ? (
                <>
                  <div
                    className={styles.cmsDebug}
                    data-index={i}
                  >
                    <div className={styles.cmsDebug__left}>
                      <p className={styles.cmsDebug__title}>CMS Title: {sectionObj?.cmsSettings?.cmsTitle || ''}</p>
                      <p className={styles.cmsDebug__type}>Type: {toCapitalizeCase(sectionObj._type)}</p>
                    </div>
                    <div className={styles.cmsDebug__right}>
                      <p className={styles.cmsDebug__spacerSettings}>
                        {hasSpacerSettings ? (
                          <span>Spacer Settings:</span>
                        ) : (
                          <span>No Spacer Settings (will use default spacing)</span>
                        )}
                      </p>
                      {hasSpacerSettings &&
                        Object.entries(sectionObj?.spacerSettings as Record<string, string>).map(([key, value]) => (
                          <p
                            className={styles.cmsDebug__spacerSettingsItem}
                            key={key}
                          >
                            {toCapitalizeCase(key)}: {typeof value === 'string' ? value : JSON.stringify(value)}
                          </p>
                        ))}
                    </div>
                  </div>
                  <SectionComponent {...sectionObj} />
                </>
              ) : (
                <SectionComponent {...sectionObj} />
              )}
            </SectionContainer>
            {i === sections.length - 1 && (
              <SectionContainer
                sectionIndex={i + 1}
                cmsTitle={'footer'}
                _type={'footer'}
                sectionsLength={sections.length}
                nextSectionType={undefined}
              >
                <Footer />
              </SectionContainer>
            )}
          </Fragment>
        )
      })}
    </>
  )
}

export default Sections
