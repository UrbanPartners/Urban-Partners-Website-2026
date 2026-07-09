'use client'

import classNames from 'classnames'
import styles from './IntroImageScroller.module.scss'
import SanityImage from '@/components/SanityImage/SanityImage'
import { CSSProperties, useEffect, useRef } from 'react'
import useWindowResize from '@/hooks/use-window-resize'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useOurStoryScrollerContext } from '@/sections/OurStoryScroller/OurStoryScrollerContext'

ScrollTrigger.config({
  ignoreMobileResize: true,
})

gsap.registerPlugin(ScrollTrigger)

type IntroImageScrollerProps = {
  className?: string
  image: SanityOurStoryScrollerIntroSection['image']
}

const TIMELINE_ITEM_DURATION = 1

const SECTION_SCROLL_VH_MULTIPLIER = 4
const FINAL_SCALE_OUT_DURATION = TIMELINE_ITEM_DURATION * 1.4

const BG_COUNT = 3

const IntroImageScroller = ({ className, image }: IntroImageScrollerProps) => {
  const height = SECTION_SCROLL_VH_MULTIPLIER * 100
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRef = useRef<HTMLDivElement | null>(null)
  const bgContainerRefs = useRef<(HTMLDivElement | null)[]>([])
  const nonMaskedBgRef = useRef<HTMLDivElement | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const timelineRef = useRef<GSAPTimeline | null>(null)
  const resizeKey = useWindowResize()
  const { setCaseStudyScaleoutDistance, setIntroImageFull } = useOurStoryScrollerContext()

  useEffect(() => {
    const fire = () => {
      if (!containerRef.current || !itemRef.current) return
      if (!bgContainerRefs.current.length) return

      if (timelineRef.current) {
        timelineRef.current.kill()
      }

      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }

      const duration = TIMELINE_ITEM_DURATION
      const windowHeight = window.innerHeight

      const timeline = gsap.timeline({ paused: true })
      timelineRef.current = timeline

      /*


      ANIMATE IN — the 3 divs translate up into place while their clip reveals


      */

      bgContainerRefs.current.forEach((bgContainer, bgIndex) => {
        if (!bgContainer) return

        timeline.fromTo(
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
            duration,
          },
          `${duration * 0.2 * bgIndex}`,
        )
      })

      /*


      NON-MASKED REVEAL — a full-cover image whose left-to-right clip is SET (not
      tweened) at each column checkpoint: 0 width until the second column has
      finished, then snapped to 50%, then snapped to 100% once the third column
      has finished. These are near-instant scrubbed tweens so they snap back to
      the previous state as you scroll back up.


      */

      if (nonMaskedBgRef.current) {
        // snap to 50% the moment the second column finishes animating up (t=1.2)
        timeline.fromTo(
          nonMaskedBgRef.current,
          {
            '--reveal': '0%',
          },
          {
            '--reveal': '50%',
            duration: 0.0001,
          },
          `${duration * 1.2}`,
        )

        // snap to 100% the moment the third column finishes animating up (t=1.4).
        // Flag the intro image as full once revealed, and (because this is a
        // scrubbed trigger) un-flag it when scrolling back past this point.
        timeline.fromTo(
          nonMaskedBgRef.current,
          {
            '--reveal': '50%',
          },
          {
            '--reveal': '100%',
            duration: 0.0001,
            immediateRender: false,
            onComplete: () => setIntroImageFull(true),
            onReverseComplete: () => setIntroImageFull(false),
          },
          `${duration * 1.4}`,
        )
      }

      /*


      PAUSE


      */

      timeline.to(
        {},
        {
          duration: duration * 3,
        },
      )

      /*


      ANIMATE OUT — the entire section scales down and translates up and out


      */

      timeline.fromTo(
        itemRef.current,
        {
          scale: 1,
          y: 0,
        },
        {
          scale: 0.7,
          y: '-100%',
          ease: 'none',
          duration: FINAL_SCALE_OUT_DURATION,
        },
        '<',
      )

      // Report how far the scale-out travels so the following section overlaps correctly
      const totalDuration = timeline.totalDuration()
      const containerHeight = containerRef.current.offsetHeight
      const finalScaleoutPixelDistance = (containerHeight * FINAL_SCALE_OUT_DURATION) / totalDuration
      setCaseStudyScaleoutDistance(finalScaleoutPixelDistance)

      scrollTriggerRef.current = new ScrollTrigger({
        trigger: containerRef.current,
        start: 'top top',
        end: `bottom+=${window.innerHeight} top`,
        animation: timeline,
        scrub: true,
      })
    }

    const fireTimeout = setTimeout(fire, 75)

    return () => {
      clearTimeout(fireTimeout)
      timelineRef.current?.kill()
      scrollTriggerRef.current?.kill()
    }
  }, [resizeKey, setCaseStudyScaleoutDistance, setIntroImageFull])

  const imageAspect = {
    tablet: 1920 / 1122,
    xs: 1 / 2,
  }

  return (
    <div
      className={classNames(styles.IntroImageScroller, className)}
      style={{ height: `${height}svh` } as CSSProperties}
      ref={containerRef}
    >
      <div
        className={styles.item}
        ref={itemRef}
      >
        {Array.from({ length: BG_COUNT }).map((_, bgIndex) => (
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
            <div className={styles.imageContainer}>
              <SanityImage
                className={styles.image}
                source={image}
                aspectRatio={imageAspect}
                columns={{
                  tablet: 12,
                  xs: 12,
                }}
                preload
              />
            </div>
          </div>
        ))}

        <div
          className={styles.bgContainerNonMasked}
          ref={nonMaskedBgRef}
        >
          <div className={styles.imageContainer}>
            <SanityImage
              className={styles.image}
              source={image}
              aspectRatio={imageAspect}
              columns={{
                tablet: 12,
                xs: 12,
              }}
              preload
            />
          </div>
        </div>
      </div>
    </div>
  )
}

IntroImageScroller.displayName = 'IntroImageScroller'

export default IntroImageScroller
