'use client'

import classnames from 'classnames'
import styles from './HomeHero.module.scss'
import Media, { MediaRef } from '@/components/Media/Media'
import RichText from '@/components/RichText/RichText'
import SplitTextComponent, { SplitTextRef } from '@/components/SplitTextComponent/SplitTextComponent'
import ColorBar, { ColorBarRef } from '@/components/ColorBar/ColorBar'
import FadeIn, { FadeInRef } from '@/components/FadeIn/FadeIn'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import LineAnimation, { LineAnimationRef } from '@/components/LineAnimation/LineAnimation'
import useInView from '@/hooks/use-in-view'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import useStore from '@/store'
import { MASK_OUT_DURATION as MASK_OUT_DURATION_PRELOADER } from '@/components/Preloader/Preloader'
import useCurrentPage from '@/hooks/use-current-page'
import RichTextSplitText, { RichTextSplitTextRef } from '@/components/RichTextSplitText/RichTextSplitText'
import MaskReveal, { MaskRevealRef } from '@/components/MaskReveal/MaskReveal'
import { VideoLoopV2ImperativeHandle } from '@/components/VideoLoopV2/VideoLoopV2'
import useBreakpoint from '@/hooks/use-breakpoint'
import useWindowResize from '@/hooks/use-window-resize'
import LineBreakElement from '@/components/LineBreakElement/LineBreakElement'
import DownArrowAnimation, { DownArrowAnimationRef } from '@/components/DownArrowAnimation/DownArrowAnimation'
import { ScrollContext } from '@/context/Scroll'

gsap.registerPlugin(ScrollTrigger)

const COLOR_BAR_DURATION = 1.5

const HomeHero = ({
  className,
  title,
  titleMobile,
  media,
  backgroundOverlay,
  descriptionTitle,
  descriptionText,
}: SanityHomeHero) => {
  const titleMobileRef = useRef<SplitTextRef>(null)
  const titleDesktopRef = useRef<SplitTextRef>(null)
  const colorBarRef = useRef<ColorBarRef>(null)
  const downArrowColorBarRef = useRef<ColorBarRef>(null)
  const lineAnimationArrowRef = useRef<LineAnimationRef | null>(null)
  const lineAnimationArrowIconRef = useRef<DownArrowAnimationRef>(null)
  const descriptionTitleRef = useRef<RichTextSplitTextRef>(null)
  const descriptionTextRef = useRef<FadeInRef>(null)
  const lineAnimationRef = useRef<LineAnimationRef | null>(null)
  const { isInView, setElementToObserve } = useInView({ fireOnce: false })
  const preloaderIsAnimatingOut = useStore(store => store.preloaderIsAnimatingOut)
  const mediaContainerRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const ranAnimation = useRef(false)
  const { shouldShowPreloader } = useCurrentPage()
  const animatedInImage = useRef(false)
  const mediaMaskRevealRef = useRef<MaskRevealRef>(null)
  const backgroundOverlayContainerRef = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const mediaRef = useRef<MediaRef>(null)
  const { isMobile } = useBreakpoint()
  const resizeKey = useWindowResize()
  const [isHoveringDownArrow, setIsHoveringDownArrow] = useState(false)
  const { scroll } = useContext(ScrollContext)

  const animateImage = (isPreloaderAnimation = true) => {
    const scaleAndAnimateMedia = () => {
      if (mediaContainerRef.current) {
        if (animatedInImage.current) return
        animatedInImage.current = true
        gsap.set(mediaContainerRef.current, {
          opacity: 1,
        })
        if (backgroundOverlayContainerRef.current) {
          gsap.set(backgroundOverlayContainerRef.current, {
            opacity: 1,
          })
        }
        gsap.to(mediaContainerRef.current, {
          scale: 1,
          translateY: 0,
          duration: MASK_OUT_DURATION_PRELOADER * 1.8,
          ease: 'Power3.easeOut',
        })

        // if (mediaRef.current) {
        //   const videoPlayer = mediaRef.current as VideoLoopV2ImperativeHandle
        //   if (videoPlayer.playVideo) {
        //     videoPlayer.playVideo()
        //   }
        // }
      }
    }

    if (isPreloaderAnimation) {
      scaleAndAnimateMedia()
    } else {
      scaleAndAnimateMedia()
      if (mediaMaskRevealRef.current) {
        mediaMaskRevealRef.current?.animateIn()
      }
    }
  }

  const animateIn = (isPreloaderAnimation = true) => {
    const maskRevealDuration = isPreloaderAnimation ? 0 : MASK_OUT_DURATION_PRELOADER * 1000 * 0.7

    setTimeout(() => {
      if (colorBarRef.current) {
        colorBarRef.current.animateIn()
      }
    }, maskRevealDuration)

    setTimeout(
      () => {
        if (descriptionTitleRef.current) {
          descriptionTitleRef.current.animateIn()
        }

        setTimeout(() => {
          if (descriptionTextRef.current) {
            descriptionTextRef.current.animateIn()
          }
        }, 0.3)
      },
      COLOR_BAR_DURATION * 1000 * 0.7 + maskRevealDuration,
    )

    setTimeout(
      () => {
        if (titleMobileRef.current) {
          titleMobileRef.current.animateIn()
        }

        if (titleDesktopRef.current) {
          titleDesktopRef.current.animateIn()
        }

        if (lineAnimationRef.current) {
          lineAnimationRef.current.animateIn()
        }

        setTimeout(() => {
          if (lineAnimationArrowIconRef.current) {
            lineAnimationArrowIconRef.current.animateIn()
          }
        }, 1000)

        if (lineAnimationArrowRef.current) {
          lineAnimationArrowRef.current.animateIn()
        }
      },
      COLOR_BAR_DURATION * 1000 * 0.2 + maskRevealDuration,
    )
  }

  useLayoutEffect(() => {
    if (!isInView) return
    if (ranAnimation.current) return
    ranAnimation.current = true
    setTimeout(() => {
      animateImage(false)
      animateIn(shouldShowPreloader)
    }, 10)
  }, [isInView, shouldShowPreloader])

  useEffect(() => {
    if (ranAnimation.current) return
    if (shouldShowPreloader) {
      if (preloaderIsAnimatingOut) {
        animateImage(true)
      }
    }
  }, [preloaderIsAnimatingOut, shouldShowPreloader, isInView])

  useEffect(() => {
    if (!ranAnimation.current) return
    const videoPlayer = mediaRef.current as VideoLoopV2ImperativeHandle

    if (!videoPlayer) return

    if (!isInView) {
      if (videoPlayer.stopVideo) {
        videoPlayer.stopVideo()
      }
    } else {
      if (videoPlayer.playVideo) {
        videoPlayer.playVideo()
      }
    }
  }, [isInView])

  useEffect(() => {
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
    }

    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    if (isMobile) return

    timelineRef.current = gsap.timeline()
    timelineRef.current.fromTo(
      mediaContainerRef.current,
      {
        y: 0,
      },
      {
        y: window.innerHeight * 0.5,
        ease: 'none',
      },
    )

    scrollTriggerRef.current = ScrollTrigger.create({
      animation: timelineRef.current,
      scrub: true,
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom top',
    })

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [isMobile, resizeKey])

  if (!titleMobile || !title || !media || !descriptionText?.length || !descriptionTitle?.length) {
    return null
  }

  return (
    <div
      className={classnames(styles.HomeHero, className)}
      ref={ref => {
        setElementToObserve(ref)
        containerRef.current = ref
      }}
    >
      <div className={styles.inner}>
        <MaskReveal
          ref={mediaMaskRevealRef}
          direction="FROM_BOTTOM"
          maskType="twoColumns"
          showInitially={shouldShowPreloader}
          className={styles.mediaMaskReveal}
          inConfig={{
            duration: MASK_OUT_DURATION_PRELOADER,
          }}
        >
          <div
            className={styles.mediaContainer}
            ref={mediaContainerRef}
          >
            <Media
              cover
              source={media}
              ref={mediaRef}
              className={classnames(styles.media, { [styles.imageLoaded]: imageLoaded })}
              imageProps={{
                preload: true,
                animated: false,
                onReady: () => {
                  setImageLoaded(true)
                },
              }}
              videoProps={{
                disableInView: true,
                onReady: () => {
                  setImageLoaded(true)
                },
              }}
            />
          </div>
          <div
            ref={backgroundOverlayContainerRef}
            className={styles.backgroundOverlayContainer}
          >
            <div
              className={styles.backgroundOverlay}
              style={{ opacity: (backgroundOverlay || 0) / 100 }}
            />
          </div>
        </MaskReveal>

        <div className={styles.titleContent}>
          <LineAnimation
            ref={lineAnimationRef}
            position="bottom"
            animateFrom="left"
            longerDuration
            inConfig={defaultConfig => ({
              duration: defaultConfig.duration * 1.5,
              ease: 'Power3.easeInOut',
            })}
          />
          <button
            className={classnames(styles.lineAnimationArrowContainer, {
              [styles.isHoveringDownArrow]: isHoveringDownArrow,
            })}
            onClick={() => {
              if (scroll && containerRef.current) {
                scroll?.scrollTo(containerRef.current?.offsetHeight)
              }
            }}
            onMouseEnter={() => {
              if (isMobile) return
              lineAnimationArrowIconRef.current?.animateArrowLoop()
              downArrowColorBarRef.current?.animateIn()
              setIsHoveringDownArrow(true)
            }}
            onMouseLeave={() => {
              if (isMobile) return
              downArrowColorBarRef.current?.animateOut()
              setIsHoveringDownArrow(false)
            }}
          >
            <LineAnimation
              ref={lineAnimationArrowRef}
              position="left"
              animateFrom="bottom"
              longerDuration
              className={styles.lineAnimationArrowLineAnimation}
              inConfig={defaultConfig => ({
                delay: defaultConfig.duration,
              })}
            />
            <DownArrowAnimation
              ref={lineAnimationArrowIconRef}
              className={styles.lineAnimationArrowIcon}
            />
            <ColorBar
              ref={downArrowColorBarRef}
              transformOrigin="left"
              className={styles.downArrowColorBar}
              inConfig={{
                ease: 'Power3.easeOut',
                duration: 0.6,
              }}
            />
          </button>
          <SplitTextComponent
            ref={titleMobileRef}
            type="lines"
            inConfig={{
              duration: 1.3,
              stagger: 0.15,
            }}
            // revertOnAnimateIn={false}
            className={styles.titleMobile}
          >
            <LineBreakElement
              className={styles.title__text}
              text={titleMobile}
            />
          </SplitTextComponent>
          <SplitTextComponent
            ref={titleDesktopRef}
            type="words"
            inConfig={{
              duration: 1.3,
            }}
            // revertOnAnimateIn={false}
            className={styles.titleDesktop}
          >
            <h1 className={styles.title__text}>{title}</h1>
          </SplitTextComponent>
        </div>
        <div className={styles.descriptionContent}>
          <ColorBar
            ref={colorBarRef}
            transformOrigin="bottom"
            className={styles.colorBar}
            inConfig={{
              ease: 'Power3.easeOut',
              duration: COLOR_BAR_DURATION,
            }}
          />
          <div className={styles.descriptionTitleContent}>
            <RichTextSplitText
              className={styles.descriptionTitleSplitText}
              ref={descriptionTitleRef}
              content={descriptionTitle}
              revertOnAnimateIn={true}
            />
          </div>
          <div className={styles.descriptionTextContent}>
            <FadeIn ref={descriptionTextRef}>
              <RichText content={descriptionText} />
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}

HomeHero.displayName = 'HomeHero'

export default HomeHero
