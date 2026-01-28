'use client'

import classnames from 'classnames'
import styles from './LocationsSection.module.scss'
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import RichText from '@/components/RichText/RichText'
import TextAndIconButton from '@/components/TextAndIconButton/TextAndIconButton'
import SanityImage from '@/components/SanityImage/SanityImage'
import useStickyTop from '@/hooks/use-sticky-top'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import useWindowResize from '@/hooks/use-window-resize'
import { useOurStoryScrollerContext } from '@/sections/OurStoryScroller/OurStoryScrollerContext'
import useBreakpoint from '@/hooks/use-breakpoint'

gsap.registerPlugin(ScrollTrigger)

const TIMELINE_DURATION = 1

const INTRO_ANIMATION_HEIGHT_MULTIPLIER = 2.5
const OUTRO_ANIMATION_HEIGHT_MULTIPLIER = 2.5

const LocationsSection = ({ title, description, cta, locations }: SanityOurStoryScrollerLocationsSection) => {
  const { setStickyElement, setStickyElementParent } = useStickyTop()

  const titleContainerRef = useRef<HTMLDivElement | null>(null)
  const descriptionRef = useRef<HTMLDivElement | null>(null)
  const ctaContainerRef = useRef<HTMLDivElement | null>(null)
  const locationsImagesRef = useRef<HTMLDivElement | null>(null)
  const animatedBarsItemsRefs = useRef<HTMLDivElement[]>([])
  const timelineRef = useRef<GSAPTimeline | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const outroTimelineRef = useRef<GSAPTimeline | null>(null)
  const outroScrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const resizeKey = useWindowResize()
  const verticalLineRef = useRef<HTMLDivElement | null>(null)
  const horizontalLineRef = useRef<HTMLDivElement | null>(null)
  const [activeLocationIndex, setActiveLocationIndex] = useState<number | null>(0)
  const locationsListInnerRef = useRef<HTMLDivElement | null>(null)
  const stickyContentRef = useRef<HTMLDivElement | null>(null)
  const stickyContentBgRef = useRef<HTMLDivElement | null>(null)
  const { isMobile } = useBreakpoint()
  const outroAnimationHeightMultiplier = useMemo(
    () => (isMobile ? OUTRO_ANIMATION_HEIGHT_MULTIPLIER * 2 : OUTRO_ANIMATION_HEIGHT_MULTIPLIER),
    [isMobile],
  )

  const { setLocationsOutroDistance } = useOurStoryScrollerContext()

  const setDefaultRefState = () => {
    gsap.set(
      [
        titleContainerRef.current,
        descriptionRef.current,
        ctaContainerRef.current,
        locationsImagesRef.current,
        ...animatedBarsItemsRefs.current,
        verticalLineRef.current,
        horizontalLineRef.current,
        stickyContentRef.current,
        stickyContentBgRef.current,
      ],
      { clearProps: 'all' },
    )
  }

  /* ==============================
  Intro
  ============================== */
  useEffect(() => {
    if (!containerRef.current) return

    if (timelineRef.current) {
      timelineRef.current.kill()
    }
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
    }

    timelineRef.current = gsap.timeline({ paused: true })

    const topDistance = window.innerHeight * INTRO_ANIMATION_HEIGHT_MULTIPLIER
    const duration = TIMELINE_DURATION
    const ease = 'Power3.easeOut'

    // Animate bars
    animatedBarsItemsRefs.current.forEach((bar, index) => {
      const initialLabel = 'firstBarAboutToAnimate'

      if (timelineRef.current && index === 0) {
        timelineRef.current.addLabel(initialLabel)
      }

      let startAt = `<+=${duration * 0.25}`

      if (isMobile) {
        startAt = index === 0 ? `<+=${duration * 0.25}` : `${initialLabel}+=${duration * 0.5}`
      }

      timelineRef.current?.fromTo(
        bar,
        {
          y: '100%',
        },
        {
          y: 0,
          duration,
          ease,
        },
        startAt,
      )

      // Animate In Title
      if (index === 2) {
        if (titleContainerRef.current) {
          timelineRef.current?.fromTo(
            titleContainerRef.current,
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration,
              ease,
            },
            '<',
          )
        }

        if (descriptionRef.current) {
          timelineRef.current?.fromTo(
            descriptionRef.current,
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration,
              ease,
            },
            '<',
          )
        }

        if (ctaContainerRef.current) {
          timelineRef.current?.fromTo(
            ctaContainerRef.current,
            {
              opacity: 0,
            },
            {
              opacity: 1,
              duration,
              ease,
            },
            '<',
          )
        }

        if (locationsImagesRef.current) {
          timelineRef.current?.fromTo(
            locationsImagesRef.current,
            {
              '--left-y': '100%',
              '--right-y': '100%',
            },
            {
              '--left-y': '0%',
              '--right-y': '0%',
              duration,
              ease,
            },
            '<',
          )
        }

        if (isMobile && index === 2 && stickyContentBgRef.current) {
          timelineRef.current?.fromTo(
            stickyContentBgRef.current,
            {
              scaleY: 0,
            },
            {
              scaleY: 1,
              duration: duration * 0.4,
              ease: 'none',
            },
            `<+=${duration * 0.5}`,
          )
        }
      }

      // Animate In Lines
      if (index === 1) {
        if (verticalLineRef.current) {
          timelineRef.current?.fromTo(
            verticalLineRef.current,
            {
              scaleY: 0,
            },
            {
              scaleY: 1,
              duration,
              ease,
            },
            '<',
          )
        }

        if (horizontalLineRef.current) {
          timelineRef.current?.fromTo(
            horizontalLineRef.current,
            {
              scaleX: 0,
            },
            {
              scaleX: 1,
              duration,
              ease,
            },
            '<',
          )
        }
      }
    })

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `top+=${topDistance} top`,
      scrub: true,
      animation: timelineRef.current,
    })
  }, [resizeKey, isMobile])

  /* ==============================
  Outro
  ============================== */
  useEffect(() => {
    if (!locationsListInnerRef.current) return

    if (outroTimelineRef.current) {
      outroTimelineRef.current.kill()
    }

    if (outroScrollTriggerRef.current) {
      outroScrollTriggerRef.current.kill()
    }

    outroTimelineRef.current = gsap.timeline({ paused: true })

    const duration = TIMELINE_DURATION
    const ease = 'Power3.easeOut'

    animatedBarsItemsRefs.current.forEach((bar, index) => {
      outroTimelineRef.current?.fromTo(
        bar,
        {
          y: 0,
        },
        {
          y: '-100%',
          duration,
          ease,
        },
        index === 0 ? '0' : duration * 0.1,
      )

      if (index === 0) {
        // Remove pointer events

        if (containerRef.current) {
          outroTimelineRef.current?.fromTo(
            containerRef.current,
            {
              pointerEvents: 'all',
            },

            {
              pointerEvents: 'none',
              duration: 0.00001,
            },
            '<',
          )
        }

        outroTimelineRef.current?.fromTo(
          titleContainerRef.current,
          {
            top: 0,
          },
          {
            top: -window.innerHeight,
            duration,
            ease,
          },
          '<',
        )

        if (stickyContentRef.current) {
          outroTimelineRef.current?.fromTo(
            stickyContentRef.current,
            {
              y: 0,
            },
            {
              y: -window.innerHeight,
              duration,
              ease,
            },
            '<',
          )
        }
      }
    })

    const bottomDistance = window.innerHeight * outroAnimationHeightMultiplier

    setLocationsOutroDistance(bottomDistance)

    outroScrollTriggerRef.current = ScrollTrigger.create({
      trigger: locationsListInnerRef.current,
      start: 'bottom top+=50%',
      end: `bottom+=${bottomDistance} bottom`,
      scrub: true,
      animation: outroTimelineRef.current,
    })

    // initial set
    setDefaultRefState()
  }, [resizeKey, setLocationsOutroDistance, isMobile, outroAnimationHeightMultiplier])

  return (
    <div
      className={classnames(styles.LocationsSection)}
      ref={ref => {
        setStickyElementParent(ref)
        containerRef.current = ref
      }}
      style={
        {
          '--intro-animation-height-multiplier': INTRO_ANIMATION_HEIGHT_MULTIPLIER,
          '--outro-animation-height-multiplier': outroAnimationHeightMultiplier,
        } as CSSProperties
      }
    >
      <div className={styles.animatedBars}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={styles.animatedBars__item}
            ref={ref => {
              if (ref) {
                animatedBarsItemsRefs.current[index] = ref
              }
            }}
          />
        ))}
      </div>
      <div
        className={styles.titleContainer}
        ref={ref => {
          titleContainerRef.current = ref
          setStickyElement(ref)
        }}
      >
        <p className={styles.title__text}>{title}</p>
      </div>
      <div
        className={styles.stickyContent}
        ref={stickyContentRef}
      >
        <div
          className={styles.stickyContent__bg}
          ref={stickyContentBgRef}
        />
        <div
          className={styles.verticalLine}
          ref={verticalLineRef}
        />
        <div
          className={styles.horizontalLine}
          ref={horizontalLineRef}
        />
        <div className={styles.stickyContent__top}>
          <div
            className={styles.stickyContent__description}
            ref={descriptionRef}
          >
            {!!description?.length && <RichText content={description} />}
          </div>
        </div>
        <div className={styles.stickyContent__bottom}>
          {!!cta && (
            <div
              className={styles.ctaContainer}
              ref={ctaContainerRef}
            >
              <TextAndIconButton
                className={styles.cta}
                link={cta}
                style="short-light-theme"
              />
            </div>
          )}
          <div
            className={styles.locationsImages}
            ref={locationsImagesRef}
          >
            {locations.map((location, i) => (
              <div
                key={`${location._key}_${i}`}
                className={styles.imageContainer}
              >
                <SanityImage
                  source={location.image}
                  columns={2}
                  className={classnames(styles.image, {
                    [styles.active]: activeLocationIndex === i,
                  })}
                  preload
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.locationsList}>
        <div
          className={styles.locationsListInner}
          ref={locationsListInnerRef}
        >
          {locations.map((location, i) => (
            <LocationTitle
              key={`${location._key}_${i}`}
              title={location.title}
              setActiveLocationIndex={setActiveLocationIndex}
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

LocationsSection.displayName = 'LocationsSection'

const LocationTitle = ({
  title,
  setActiveLocationIndex,
  index,
}: {
  title: string
  setActiveLocationIndex: (index: number) => void
  index: number
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const scrollTriggerActiveIndexRef = useRef<ScrollTrigger | null>(null)
  const timelineRef = useRef<GSAPTimeline | null>(null)
  const resizeKey = useWindowResize()
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    if (!containerRef.current) return

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
    }

    if (scrollTriggerActiveIndexRef.current) {
      scrollTriggerActiveIndexRef.current.kill()
    }

    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    timelineRef.current = gsap.timeline({ paused: true })

    timelineRef.current.fromTo(
      containerRef.current,
      {
        opacity: 0.2,
      },
      {
        opacity: 1,
        ease: 'none',
      },
    )

    timelineRef.current.fromTo(
      containerRef.current,
      {
        opacity: 1,
      },
      {
        opacity: 0.2,
        ease: 'none',
      },
    )

    const height = containerRef.current.offsetHeight
    const windowHeight = window.innerHeight

    let start = `top top+=${windowHeight * 0.5 + height}`
    if (isMobile) {
      start = `top top+=${windowHeight * 0.5 + height}`
    }

    let end = `top top+=${windowHeight * 0.5 - height * 2}`
    if (isMobile) {
      end = `top top+=${windowHeight * 0.5 - height}`
    }

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start,
      end,
      scrub: true,
      animation: timelineRef.current,
    })

    if (isMobile) return

    scrollTriggerActiveIndexRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: `top top+=${windowHeight * 0.5}`,
      end: `top top+=${windowHeight * 0.5 - height}`,
      scrub: true,
      onEnter: () => {
        setActiveLocationIndex(index)
      },
      onLeaveBack: () => {
        const prevIndex = index - 1
        if (prevIndex < 0) return
        setActiveLocationIndex(prevIndex)
      },
    })

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }
      if (scrollTriggerActiveIndexRef.current) {
        scrollTriggerActiveIndexRef.current.kill()
      }
    }
  }, [resizeKey, index, setActiveLocationIndex, isMobile])

  return (
    <div
      className={styles.locationTitle}
      ref={containerRef}
    >
      <p className={styles.locationTitle__text}>{title}</p>
    </div>
  )
}

export default LocationsSection
