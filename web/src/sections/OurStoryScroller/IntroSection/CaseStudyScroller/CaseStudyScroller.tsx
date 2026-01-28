import classNames from 'classnames'
import styles from './CaseStudyScroller.module.scss'
import SanityImage from '@/components/SanityImage/SanityImage'
import RichTextSplitText from '@/components/RichTextSplitText/RichTextSplitText'
import SplitTextComponent, {
  DEFAULT_IN_CONFIG as SPLIT_TEXT_DEFAULT_IN_CONFIG,
  SplitTextRef,
} from '@/components/SplitTextComponent/SplitTextComponent'
import { CSSProperties, useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import TextAndIconButton from '@/components/TextAndIconButton/TextAndIconButton'
import useWindowResize from '@/hooks/use-window-resize'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import GridOverlay from '@/sections/OurStoryScroller/GridOverlay/GridOverlay'
import { useOurStoryScrollerContext } from '@/sections/OurStoryScroller/OurStoryScrollerContext'
import useStickyTop from '@/hooks/use-sticky-top'
import useBreakpoint from '@/hooks/use-breakpoint'

ScrollTrigger.config({
  ignoreMobileResize: true,
})

gsap.registerPlugin(ScrollTrigger)

type CaseStudyScrollerProps = SanityOurStoryScrollerIntroSection & {
  className?: string
}

const TIMELINE_ITEM_DURATION = 1

const SECTION_SCROLL_VH_MULTIPLIER = 3.5
const FINAL_SCALE_OUT_DURATION = TIMELINE_ITEM_DURATION * 1.7

const CaseStudyScroller = ({ className, caseStudyItems, caseStudyListDescription }: CaseStudyScrollerProps) => {
  const height = caseStudyItems.length * SECTION_SCROLL_VH_MULTIPLIER * 100
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const caseStudyItemsRefs = useRef<CaseStudyItemRef[]>([])
  const [caseStudyRecalibrated, setCaseStudyRecalibrated] = useState<number | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const timelineRef = useRef<GSAPTimeline | null>(null)
  const [caseStudiesInitiallyCalculated, setCaseStudiesInitiallyCalculated] = useState(false)
  const caseStudiesRecalibratedRef = useRef<number[]>([])
  const caseStudyItemsContainerRef = useRef<HTMLDivElement | null>(null)
  const listDescriptionRef = useRef<HTMLDivElement | null>(null)
  const gridOverlayElRef = useRef<HTMLDivElement | null>(null)
  const { setCaseStudyScaleoutDistance } = useOurStoryScrollerContext()
  const { setStickyElement, setStickyElementParent } = useStickyTop()

  useEffect(() => {
    if (caseStudyRecalibrated === null) return
    if (!caseStudiesRecalibratedRef.current.includes(caseStudyRecalibrated)) {
      const itemLength = caseStudyItems.length
      caseStudiesRecalibratedRef.current = [...caseStudiesRecalibratedRef.current, caseStudyRecalibrated]
      if (caseStudiesRecalibratedRef.current.length === itemLength) {
        setCaseStudiesInitiallyCalculated(true)
      }
    }
  }, [caseStudyRecalibrated, caseStudyItems])

  // Fallback in case not initially calculated
  useEffect(() => {
    setTimeout(() => {
      setCaseStudiesInitiallyCalculated(true)
    }, 500)
  }, [])

  useEffect(() => {
    if (!caseStudiesInitiallyCalculated) return
    if (!containerRef.current || !caseStudyItemsContainerRef.current) return
    if (!caseStudyItemsRefs.current?.length) return

    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
    }

    timelineRef.current = gsap.timeline({ paused: true })

    caseStudyItemsRefs.current.forEach((item, index) => {
      if (item?.createTimeline) {
        const delay = index === 0 ? '+=0' : `-=${TIMELINE_ITEM_DURATION * 3.2}`
        timelineRef.current?.add(item?.createTimeline() as GSAPTimeline, delay)
      }
    })

    const totalDuration = timelineRef.current.totalDuration()
    const containerHeight = containerRef.current?.offsetHeight
    const finalScaleoutDuration = FINAL_SCALE_OUT_DURATION
    const finalScaleoutPixelDistance = (containerHeight * finalScaleoutDuration) / totalDuration
    setCaseStudyScaleoutDistance(finalScaleoutPixelDistance)

    scrollTriggerRef.current = new ScrollTrigger({
      trigger: containerRef.current,
      start: 'top top',
      end: `bottom+=${window.innerHeight} top`,
      animation: timelineRef.current,
      scrub: true,
    })
  }, [caseStudyRecalibrated, caseStudiesInitiallyCalculated, caseStudyItems.length, setCaseStudyScaleoutDistance])

  const onFinalAnimateOut = (timeline: GSAPTimeline) => {
    if (!timeline) return
    // get the last child index
    const lastChildIndex = caseStudyItemsRefs.current.length - 1
    const lastChildContainer = caseStudyItemsRefs.current[lastChildIndex]?.getContainer()
    if (lastChildContainer) {
      timeline.fromTo(
        lastChildContainer,
        {
          y: 0,
        },
        {
          y: '-100%',
          ease: 'none',
          duration: FINAL_SCALE_OUT_DURATION,
        },
        '<',
      )
    }

    if (listDescriptionRef.current) {
      timeline.fromTo(
        listDescriptionRef.current,
        {
          opacity: 1,
        },
        {
          opacity: 0,
          duration: TIMELINE_ITEM_DURATION * 0.5,
        },
        '<',
      )
    }

    if (gridOverlayElRef.current) {
      timeline.fromTo(
        gridOverlayElRef.current,
        {
          opacity: 1,
        },
        {
          opacity: 0,
          duration: TIMELINE_ITEM_DURATION,
        },
        '<',
      )
    }

    if (containerRef.current) {
      timeline.fromTo(
        containerRef.current,
        {
          pointerEvents: 'all',
        },
        {
          pointerEvents: 'none',
          duration: 0.001,
        },
        '<',
      )
    }
  }

  return (
    <div
      className={classNames(styles.CaseStudyScroller, className)}
      style={{ height: `${height}svh` } as CSSProperties}
      ref={ref => {
        containerRef.current = ref
        setStickyElementParent(ref)
      }}
    >
      <div
        className={styles.listDescription}
        ref={ref => {
          listDescriptionRef.current = ref
          setStickyElement(ref)
        }}
      >
        <RichTextSplitText
          splitTextProps={{ animateInView: true }}
          content={caseStudyListDescription}
          className={styles.listDescriptionText}
        />
      </div>
      <div
        ref={caseStudyItemsContainerRef}
        className={styles.caseStudyItems}
      >
        <GridOverlay
          ref={ref => {
            if (ref?.getElement()) {
              gridOverlayElRef.current = ref?.getElement()
            }
          }}
          className={styles.gridOverlay}
          hasLeftLine
          hasMiddleLine
          hasRightLine
          lineColor="var(--our-story-case-study-line-color)"
        />
        {caseStudyItems.map((item, index) => (
          <CaseStudyItem
            key={item._key}
            {...item}
            index={index}
            masterContainerRef={containerRef}
            setActiveIndex={setActiveIndex}
            activeIndex={activeIndex}
            setCaseStudyRecalibrated={setCaseStudyRecalibrated}
            ref={el => {
              if (el) {
                caseStudyItemsRefs.current[index] = el
              }
            }}
            isLast={index === caseStudyItems.length - 1}
            onFinalAnimateOut={onFinalAnimateOut}
            gridOverlayElRef={gridOverlayElRef.current}
            listDescriptionRef={listDescriptionRef.current}
          />
        ))}
      </div>
    </div>
  )
}

export interface CaseStudyItemRef {
  createTimeline: () => GSAPTimeline | null
  getContainer: () => HTMLDivElement | null
}

type CaseStudyItemProps = SanityOurStoryScrollerIntroSectionCaseStudyItem & {
  index: number
  className?: string
  masterContainerRef: React.RefObject<HTMLDivElement | null>
  setActiveIndex: (index: number) => void
  activeIndex: number
  setCaseStudyRecalibrated: (index: number) => void
  isLast: boolean
  onFinalAnimateOut?: (timeline: GSAPTimeline) => void
  gridOverlayElRef: HTMLDivElement | null
  listDescriptionRef: HTMLDivElement | null
}

const CaseStudyItem = forwardRef<CaseStudyItemRef, CaseStudyItemProps>(
  (
    {
      index,
      className,
      title,
      description,
      image,
      imageOverlayOpacity = 0.5,
      cta,
      setActiveIndex,
      activeIndex,
      masterContainerRef,
      setCaseStudyRecalibrated,
      isLast,
      onFinalAnimateOut,
      gridOverlayElRef,
      listDescriptionRef,
    },
    ref,
  ) => {
    const titleRef = useRef<SplitTextRef | null>(null)
    const descriptionRef = useRef<SplitTextRef | null>(null)
    const timelineAnimationRef = useRef<GSAPTimeline | null>(null)
    const resizeKey = useWindowResize()
    const bgContainerRefs = useRef<(HTMLDivElement | null)[]>([])
    const ctaContainerRef = useRef<HTMLDivElement | null>(null)
    const { isMobile } = useBreakpoint()
    const [scrollTriggerInitialized, setScrollTriggerInitialized] = useState(isMobile ? true : false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const fadeOutBgRef = useRef<HTMLDivElement | null>(null)
    const nonMaskedBgRef = useRef<HTMLDivElement | null>(null)

    const createTimeline = useCallback(() => {
      if (!bgContainerRefs.current.length || !containerRef.current) {
        return null
      }

      if (timelineAnimationRef.current) {
        timelineAnimationRef.current.kill()
      }

      timelineAnimationRef.current = gsap.timeline()

      // timelineAnimationRef.current.to(containerRef.current, {
      //   backgroundColor: 'green',
      // })

      // return timelineAnimationRef.current

      const duration = TIMELINE_ITEM_DURATION
      const windowHeight = window.innerHeight

      /*


      ANIMATE IN


      */

      bgContainerRefs.current.forEach((bgContainer, bgIndex) => {
        if (!bgContainer) return

        timelineAnimationRef.current?.fromTo(
          bgContainer,
          {
            '--top-left-y': '100%',
            '--top-right-y': '100%',
            y: windowHeight * 0.5,
          },
          {
            y: 0,
            '--top-left-y': '0%',
            '--top-right-y': '0%',
            duration: duration,
          },
          `${duration * 0.2 * bgIndex}`,
        )

        let elements: Element[] = []

        if (listDescriptionRef && timelineAnimationRef.current && index === 0 && bgIndex === 2) {
          timelineAnimationRef.current.fromTo(
            listDescriptionRef,
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration: duration * 0.5,
            },
            '<',
          )
        }

        // animate in grid
        if (bgIndex === 2 && index === 0 && gridOverlayElRef && timelineAnimationRef.current) {
          timelineAnimationRef.current.fromTo(
            gridOverlayElRef,
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration: duration,
            },
            '<',
          )
        }

        // animate in non-masked bg
        if (bgIndex === 2 && nonMaskedBgRef.current && timelineAnimationRef.current) {
          timelineAnimationRef.current.fromTo(
            nonMaskedBgRef.current,
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration: 0.0001,
            },
            '>',
          )
        }

        const isTextAnimation = bgIndex === 0 || bgIndex === 1

        if (bgIndex === 0) {
          elements = titleRef.current?.getElementsToAnimate() || []
        }

        if (bgIndex === 1) {
          elements = descriptionRef.current?.getElementsToAnimate() || []
        }

        if (bgIndex === 2) {
          elements = [ctaContainerRef.current as Element]
        }

        const startTextAnimation = `>-=${duration * 0.5}`

        if (isTextAnimation) {
          if (elements?.length && timelineAnimationRef.current) {
            timelineAnimationRef.current?.fromTo(
              elements,
              {
                y: '110%',
              },
              {
                ...SPLIT_TEXT_DEFAULT_IN_CONFIG,
                duration: duration,
                onStart: () => {
                  if (bgIndex === 1) {
                    setActiveIndex(index)
                  }
                },
              },
              // textAnimationToStart,
              startTextAnimation,
            )
          }
        } else {
          if (elements?.length && timelineAnimationRef.current) {
            timelineAnimationRef.current?.fromTo(
              elements,
              {
                opacity: 0,
              },
              {
                opacity: 1,
                duration,
              },
              // textAnimationToStart,
              startTextAnimation,
            )
          }
        }
      })

      /*


    PAUSE


    */

      // Add a duration * 3 pause to the animation timeline
      timelineAnimationRef.current?.to(
        {},
        {
          duration: duration * 3,
        },
      )

      /*


    ANIMATE OUT


    */

      const animateOutText = (bgIndex: number) => {
        let elements: Element[] = []

        const isTextAnimation = bgIndex === 0 || bgIndex === 1

        if (bgIndex === 0) {
          elements = titleRef.current?.getElementsToAnimate() || []
        }

        if (bgIndex === 1) {
          elements = descriptionRef.current?.getElementsToAnimate() || []
        }

        if (bgIndex === 2) {
          elements = [ctaContainerRef.current as Element]
        }

        if (isTextAnimation) {
          if (elements?.length && timelineAnimationRef.current) {
            timelineAnimationRef.current?.fromTo(
              elements,
              {
                y: 0,
              },
              {
                y: '-110%',
                duration,
              },
              '<',
            )
          }
        } else {
          if (elements?.length && timelineAnimationRef.current) {
            timelineAnimationRef.current?.fromTo(
              elements,
              {
                opacity: 1,
              },
              {
                opacity: 0,
                duration,
              },
              '<',
            )
          }
        }
      }

      const defaultAnimateOut = () => {
        bgContainerRefs.current.forEach((bgContainer, bgIndex) => {
          if (!bgContainer) return

          const offset = `<+=${duration * 0.2 * bgIndex}`

          timelineAnimationRef.current?.fromTo(
            bgContainer,
            {
              y: 0,
            },
            {
              y: windowHeight * -0.2,
              duration,
            },
            offset,
          )

          if (bgIndex === 0) {
            if (fadeOutBgRef.current) {
              timelineAnimationRef.current?.fromTo(
                fadeOutBgRef.current,
                {
                  opacity: 0,
                },
                {
                  opacity: 1,
                  duration: duration * 3,
                },
                '<',
              )
            }
          }

          animateOutText(bgIndex)
        })

        timelineAnimationRef.current?.fromTo(
          containerRef.current,
          {
            opacity: 1,
          },
          {
            opacity: 0,
            duration: 0.001,
          },
          '>',
        )
      }

      const lastItemAnimateOut = () => {
        if (onFinalAnimateOut) {
          onFinalAnimateOut(timelineAnimationRef.current as GSAPTimeline)
        }

        bgContainerRefs.current.forEach((_, bgIndex) => {
          animateOutText(bgIndex)
        })

        timelineAnimationRef.current?.fromTo(
          containerRef.current,
          {
            scale: 1,
          },
          {
            scale: 0.7,
            ease: 'none',
            duration: FINAL_SCALE_OUT_DURATION,
          },
          '<',
        )
      }

      if (isLast) {
        lastItemAnimateOut()
      } else {
        defaultAnimateOut()
      }

      // Set items from get-go

      if (gridOverlayElRef) {
        gsap.set(gridOverlayElRef, {
          opacity: 0,
        })
      }

      if (listDescriptionRef) {
        gsap.set(listDescriptionRef, {
          opacity: 0,
        })
      }

      if (ctaContainerRef.current) {
        gsap.set(ctaContainerRef.current, {
          opacity: 0,
        })
      }

      if (titleRef.current?.getElementsToAnimate()?.length) {
        gsap.set(titleRef.current?.getElementsToAnimate(), {
          y: '110%',
        })
      }

      if (descriptionRef.current?.getElementsToAnimate()) {
        gsap.set(descriptionRef.current?.getElementsToAnimate(), {
          y: '110%',
        })
      }

      return timelineAnimationRef.current as GSAPTimeline

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      resizeKey,
      masterContainerRef,
      index,
      scrollTriggerInitialized,
      isLast,
      gridOverlayElRef,
      onFinalAnimateOut,
      setActiveIndex,
      listDescriptionRef,
    ])

    useEffect(() => {
      setTimeout(
        () => {
          setCaseStudyRecalibrated(index)
        },
        Math.random() * 100 + 50,
      )

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resizeKey, masterContainerRef, index, scrollTriggerInitialized, setCaseStudyRecalibrated])

    useImperativeHandle(ref, () => ({
      createTimeline,
      getContainer: () => containerRef.current,
    }))

    const imageAspect = {
      tablet: 1920 / 1122,
      xs: 1 / 2,
    }

    const imageColumns = 12

    const bgOverlayOpacity = imageOverlayOpacity / 100 || 0.5

    return (
      <div
        className={classNames(styles.CaseStudyItem, className, {
          [styles.active]: activeIndex === index,
        })}
        style={{
          marginTop: `-${index * 100}svh`,
          zIndex: index + 1,
        }}
        data-index={index}
        ref={containerRef}
      >
        <div
          className={styles.fadeOutBg}
          ref={fadeOutBgRef}
        />
        {Array.from({ length: 3 }).map((_, bgIndex) => (
          <div
            className={styles.bgContainer}
            key={bgIndex}
            data-bg-index={bgIndex}
            ref={el => {
              if (el) {
                bgContainerRefs.current[bgIndex] = el
              }
            }}
          >
            <div
              className={styles.bgOverlay}
              style={{ opacity: bgOverlayOpacity }}
            />
            <div className={styles.imageContainer}>
              <SanityImage
                className={styles.image}
                source={image}
                aspectRatio={imageAspect}
                columns={imageColumns}
                preload
              />
            </div>
          </div>
        ))}

        <div
          className={styles.bgContainerNonMasked}
          ref={nonMaskedBgRef}
        >
          <div
            className={styles.bgOverlay}
            style={{ opacity: bgOverlayOpacity }}
          />
          <div className={styles.imageContainer}>
            <SanityImage
              className={styles.image}
              source={image}
              aspectRatio={imageAspect}
              columns={imageColumns}
              preload
            />
          </div>
        </div>

        <div className={styles.textContent}>
          <div className={styles.titleContainer}>
            <SplitTextComponent
              ref={titleRef}
              forceRendered={scrollTriggerInitialized}
              onInitialize={() => {
                setTimeout(() => {
                  setScrollTriggerInitialized(true)
                }, 20)
              }}
            >
              <h2 className={styles.title}>{title}</h2>
            </SplitTextComponent>
          </div>
          <div className={styles.descriptionContainer}>
            <SplitTextComponent ref={descriptionRef}>
              <p className={styles.description}>{description}</p>
            </SplitTextComponent>
          </div>
          <div
            className={styles.ctaContainer}
            ref={ctaContainerRef}
          >
            <TextAndIconButton
              style="white-transparent-theme"
              link={cta}
              className={styles.cta}
            />
          </div>
        </div>
      </div>
    )
  },
)

CaseStudyItem.displayName = 'CaseStudyItem'

export default CaseStudyScroller
