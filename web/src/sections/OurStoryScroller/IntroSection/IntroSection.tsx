'use client'

import { useRef, useEffect } from 'react'
import classnames from 'classnames'
import styles from './IntroSection.module.scss'
import SplitTextComponent, { SplitTextRef } from '@/components/SplitTextComponent/SplitTextComponent'
import RichTextSplitText, { RichTextSplitTextRef } from '@/components/RichTextSplitText/RichTextSplitText'
import LineAnimation, {
  DURATION as LINE_ANIMATION_DURATION,
  LineAnimationRef,
} from '@/components/LineAnimation/LineAnimation'
import FadeIn, { FadeInRef } from '@/components/FadeIn/FadeIn'
import CaseStudyScroller from '@/sections/OurStoryScroller/IntroSection/CaseStudyScroller/CaseStudyScroller'
import DownArrowAnimation, { DownArrowAnimationRef } from '@/components/DownArrowAnimation/DownArrowAnimation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import useWindowResize from '@/hooks/use-window-resize'
import useBreakpoint from '@/hooks/use-breakpoint'

gsap.registerPlugin(ScrollTrigger)

const IntroSection = ({
  title,
  subtitle,
  description,
  caseStudyListDescription,
  caseStudyItems,
}: SanityOurStoryScrollerIntroSection) => {
  const introSectionRef = useRef<HTMLDivElement | null>(null)
  const introRef = useRef<HTMLDivElement | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const lineAnimationBottomRef = useRef<LineAnimationRef>(null)
  const lineAnimationTopRef = useRef<LineAnimationRef>(null)
  const lineAnimationMidRef = useRef<LineAnimationRef>(null)
  const lineAnimationDescRef = useRef<LineAnimationRef>(null)
  const lineAnimationSubtitleRef = useRef<LineAnimationRef>(null)
  const titleRef = useRef<SplitTextRef>(null)
  const subtitleRef = useRef<FadeInRef>(null)
  const descriptionRef = useRef<RichTextSplitTextRef>(null)
  const downArrowRef = useRef<DownArrowAnimationRef>(null)
  const resizeKey = useWindowResize()
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    setTimeout(() => {
      lineAnimationBottomRef.current?.animateIn()
      lineAnimationTopRef.current?.animateIn()
      lineAnimationMidRef.current?.animateIn()
      lineAnimationDescRef.current?.animateIn()
      lineAnimationSubtitleRef.current?.animateIn()
      titleRef.current?.animateIn()
      subtitleRef.current?.animateIn()
      descriptionRef.current?.animateIn()
      downArrowRef.current?.animateIn()
    }, 200)
  }, [])

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
    }

    if (isMobile) {
      return
    }

    timelineRef.current = gsap.timeline()

    timelineRef.current.fromTo(
      introRef.current,
      {
        y: 0,
      },
      {
        y: window.innerHeight * 1.5,
        ease: 'none',
      },
    )

    timelineRef.current.fromTo(
      introRef.current,
      {
        opacity: 1,
      },
      {
        opacity: 0,
        duration: 0.001,
      },
      '>',
    )

    scrollTriggerRef.current = new ScrollTrigger({
      // trigger: introSectionRef.current,
      start: 'top top',
      end: `top+=${window.innerHeight * 2} top`,
      animation: timelineRef.current,
      scrub: true,
    })
    // ScrollTrigger will be instantiated here when needed
  }, [resizeKey, isMobile])

  return (
    <>
      <div
        ref={introSectionRef}
        className={classnames(styles.IntroSection)}
      >
        <div
          className={styles.intro}
          ref={introRef}
        >
          <LineAnimation
            ref={lineAnimationBottomRef}
            position="bottom"
            animateFrom="left"
            startFull
          />
          <div className={styles.intro__top}>
            <div className={styles.intro__top__left}></div>
            <div className={styles.intro__top__right}>
              <LineAnimation
                ref={lineAnimationTopRef}
                position="left"
                animateFrom="top"
                inConfig={{
                  ease: 'none',
                  duration: LINE_ANIMATION_DURATION * 0.5,
                }}
              />
              <SplitTextComponent
                ref={titleRef}
                type="chars"
                revertOnAnimateIn={false}
                inConfig={{
                  stagger: 0.035,
                }}
              >
                <h1 className={styles.intro__text}>{title}</h1>
              </SplitTextComponent>
            </div>
          </div>
          <div className={styles.intro__bottom}>
            <LineAnimation
              ref={lineAnimationMidRef}
              position="top"
              animateFrom="left"
              inConfig={{
                duration: LINE_ANIMATION_DURATION * 2,
              }}
            />
            <div />
            <div className={styles.intro__descriptionAndSubtitle}>
              <LineAnimation
                ref={lineAnimationDescRef}
                position="left"
                animateFrom="top"
                longerDuration
                inConfig={{
                  delay: LINE_ANIMATION_DURATION * 0.5,
                  duration: LINE_ANIMATION_DURATION * 1.5,
                }}
              />
              <div className={styles.intro__subtitle}>
                <LineAnimation
                  ref={lineAnimationSubtitleRef}
                  position="left"
                  animateFrom="top"
                />
                {subtitle && (
                  <FadeIn ref={subtitleRef}>
                    <p className={styles.intro__subtitleText}>{subtitle}</p>
                  </FadeIn>
                )}
              </div>
              <div className={styles.intro__description}>
                {!!description?.length && (
                  <RichTextSplitText
                    ref={descriptionRef}
                    content={description}
                  />
                )}
              </div>
            </div>
          </div>

          <DownArrowAnimation
            ref={downArrowRef}
            className={styles.intro__bottom__downArrow}
          />
        </div>
      </div>
      <CaseStudyScroller
        className={styles.caseStudyScroller}
        {...{ title, subtitle, description, caseStudyListDescription, caseStudyItems }}
      />
    </>
  )
}

IntroSection.displayName = 'IntroSection'

export default IntroSection
