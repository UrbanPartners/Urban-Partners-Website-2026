'use client'

import classnames from 'classnames'
import styles from './MediaSection.module.scss'
import Media from '@/components/Media/Media'
import { CSSProperties, useRef, useState, useEffect, useContext } from 'react'
import MediaSectionBackgroundImage from '@/sections/OurStoryScroller/MediaSection/MediaSectionBackgroundImage'
import { useOurStoryScrollerContext } from '@/sections/OurStoryScroller/OurStoryScrollerContext'
import { ControlsRef, VideoPlayerWithControlsRef } from '@/components/VideoPlayerWithControls/VideoPlayerWithControls'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import useWindowResize from '@/hooks/use-window-resize'
import { ScrollContext } from '@/context/Scroll'
import useInView from '@/hooks/use-in-view'

gsap.registerPlugin(ScrollTrigger)

const TIMELINE_DURATION = 1

const MediaSection = ({
  title,
  description,
  backgroundImageOverlay,
  backgroundImage,
  media,
}: SanityOurStoryScrollerMediaSection) => {
  const bgImageLeftSideElementRef = useRef<HTMLButtonElement | null>(null)
  const bgImageRightSideElementRef = useRef<HTMLButtonElement | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const verticalLineRef = useRef<HTMLDivElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const descriptionRef = useRef<HTMLDivElement | null>(null)
  const { locationsOutroDistance } = useOurStoryScrollerContext()
  const [clickedPlay, setClickedPlay] = useState(false)
  const controlsRef = useRef<ControlsRef | null>(null)
  const textContentInnerRef = useRef<HTMLDivElement | null>(null)
  const [renderContent, setRenderContent] = useState(true)
  const resizeKey = useWindowResize()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { scroll } = useContext(ScrollContext)
  const lineContainerRef = useRef<HTMLDivElement | null>(null)
  const { isInView, setElementToObserve } = useInView({
    fireOnce: false,
  })
  const isVideoPlayer = media?._type === 'videoPlayer'

  useEffect(() => {
    if (!isInView && controlsRef.current) {
      controlsRef.current?.pauseVideo()
    }
  }, [isInView])

  // Kill and initialize timeline and ScrollTrigger
  useEffect(() => {
    if (!containerRef.current) return

    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
    }

    // Initialize timeline and ScrollTrigger here
    timelineRef.current = gsap.timeline()
    // Add your timeline animations here

    const duration = TIMELINE_DURATION
    const ease = 'Power3.easeOut'

    timelineRef.current.fromTo(
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

    const yStart = window.innerHeight * 0.8

    if (bgImageLeftSideElementRef.current) {
      timelineRef.current.fromTo(
        bgImageLeftSideElementRef.current,
        {
          y: yStart,
        },
        {
          y: 0,
          duration,
          ease,
        },
        '<',
      )
    }

    if (bgImageRightSideElementRef.current) {
      timelineRef.current.fromTo(
        bgImageRightSideElementRef.current,
        {
          y: yStart,
        },
        {
          y: 0,
          duration,
          ease,
        },
        `<+=${duration * 0.1}`,
      )
    }

    if (titleRef.current) {
      timelineRef.current.fromTo(
        titleRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: duration * 0.5,
          ease,
        },
        `<+=${duration * 0.5}`,
      )
    }

    if (descriptionRef.current) {
      timelineRef.current.fromTo(
        descriptionRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: duration * 0.5,
          ease,
        },
        `<+=${duration * 0.1}`,
      )
    }

    scrollTriggerRef.current = ScrollTrigger.create({
      start: 'top top',
      trigger: containerRef.current,
      end: `top+=${locationsOutroDistance}px top`,
      animation: timelineRef.current,
      scrub: true,
    })

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }
    }
  }, [resizeKey, locationsOutroDistance, renderContent])

  const handlePlayClick = () => {
    setClickedPlay(true)
    setRenderContent(false)
    if (scroll && containerRef.current) {
      scroll.scrollTo(containerRef.current?.offsetTop + containerRef.current?.offsetHeight - window.innerHeight)
    }
  }

  return (
    <div
      className={classnames(
        styles.MediaSection,
        { [styles.clickedPlay]: clickedPlay },
        {
          [styles.isVideoPlayer]: isVideoPlayer,
        },
      )}
      ref={_ref => {
        containerRef.current = _ref
        setElementToObserve(_ref)
      }}
      style={
        {
          '--locations-outro-distance': `${locationsOutroDistance}px`,
        } as CSSProperties
      }
    >
      <div className={styles.stickyContainer}>
        {renderContent && (
          <div
            className={styles.lineContainer}
            ref={lineContainerRef}
          >
            <div
              className={styles.verticalLine}
              ref={verticalLineRef}
            />
            {!isVideoPlayer && <div className={styles.horizontalLine} />}
          </div>
        )}

        <div className={styles.contentContainer}>
          {backgroundImage && renderContent && (
            <>
              <MediaSectionBackgroundImage
                image={backgroundImage}
                overlay={backgroundImageOverlay}
                className={styles.bgImageLeftSide}
                controlsRef={controlsRef.current}
                setClickedPlay={setClickedPlay}
                ref={_ref => {
                  if (_ref) {
                    bgImageLeftSideElementRef.current = _ref.getElement()
                  }
                }}
                isVideoPlayer={isVideoPlayer}
              />
              <MediaSectionBackgroundImage
                image={backgroundImage}
                overlay={backgroundImageOverlay}
                className={styles.bgImageRightSide}
                controlsRef={controlsRef.current}
                setClickedPlay={setClickedPlay}
                ref={_ref => {
                  if (_ref) {
                    bgImageRightSideElementRef.current = _ref.getElement()
                  }
                }}
                isVideoPlayer={isVideoPlayer}
              />
            </>
          )}
          <Media
            source={media}
            className={styles.media}
            cover
            imageProps={{
              columns: 12,
              aspectRatio: {
                tablet: 16 / 9,
                xs: 1 / 2,
              },
            }}
            videoPlayerProps={{
              previewOverlayOpacity: 0,
              previewImage: undefined,
              initiallyHideVideoAndPreviewImage: true,
              onClickedPlay: handlePlayClick,
              disabledOutOfViewPause: true,
              lineFullWidth: true,
            }}
            ref={ref => {
              if (media?._type === 'videoPlayer') {
                const mediaRef = ref as VideoPlayerWithControlsRef
                if (mediaRef?.controls) {
                  controlsRef.current = mediaRef.controls
                }
              }
            }}
          />
          <div className={styles.textContent}>
            {renderContent && (
              <div
                className={styles.textContentInner}
                ref={textContentInnerRef}
              >
                {title && (
                  <h2
                    className={styles.title}
                    ref={titleRef}
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    className={styles.description}
                    ref={descriptionRef}
                  >
                    {description}
                  </p>
                )}

                <div />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

MediaSection.displayName = 'MediaSection'

export default MediaSection
