import useGetVideoSrc from '@/hooks/use-get-video-src'
import useInView from '@/hooks/use-in-view'
import classNames from 'classnames'
import React, { CSSProperties, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import styles from './VideoLoop.module.scss'
import { deviceInfo } from '@/utils'
import useIsReducedMotion from '@/hooks/use-is-reduced-motion'
import useWindowResize from '@/hooks/use-window-resize'
import useBreakpoint from '@/hooks/use-breakpoint'

const DESKTOP_DEBUG = false

const VideoLoop = React.forwardRef<VideoLoopImperativeHandle, VideoLoopProps>(
  (
    {
      desktopLoop,
      mobileLoop,
      desktopSizeMb,
      mobileSizeMb,
      disableInView,
      initiallyStopped,
      className,
      videoIntervalCheckMs = 20,
      videoShowDuration = '0.3s',
      id,
      coverTarget,
      onShow,
      onCanPlay,
      onLoadedMetadata,
    },
    ref,
  ) => {
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const { setElementToObserve, isInView } = useInView({
      fireOnce: false,
      scrolltriggerStart: 'top-=1200px bottom',
      scrolltriggerEnd: 'bottom+=200px top',
    })
    const videoRef = useRef<HTMLVideoElement>(null)
    const [showVideo, setShowVideo] = useState(false)
    const isIncompatable = deviceInfo.browser.name === 'firefox'
    const isPlayingRef = useRef(false)
    const { isReducedMotion } = useIsReducedMotion()
    const resizeKey = useWindowResize()
    const [dimensions, setDimensions] = useState({ w: 0, h: 0 })
    const [coverTargetDimensions, setCoverTargetDimensions] = useState({ w: 0, h: 0 })
    const [calculatedOffsets, setCalculatedOffsets] = useState({ w: 0, h: 0, topOffset: 0, leftOffset: 0 })
    const { isMobile } = useBreakpoint()
    const describedByIdRef = useRef(`described_by_${`${Math.random()}`.replace('.', '')}`)
    const [altText, setAltText] = useState<string | null>(null)

    let videoSrc: string | null = null
    const { videoSrc: src } = useGetVideoSrc({
      videoDesktop: desktopLoop,
      videoMobile: mobileLoop,
      desktopSizeMb: desktopSizeMb,
      mobileSizeMb: mobileSizeMb,
    })
    videoSrc = src

    useEffect(() => {
      if (isMobile && mobileLoop?.alt) {
        setAltText(mobileLoop.alt)
      }
      if (!isMobile && desktopLoop?.alt) {
        setAltText(desktopLoop.alt)
      }
    }, [isMobile, mobileLoop, desktopLoop])

    const getCoverTargetElement = useCallback(() => {
      let target: HTMLElement | null = null
      if (typeof coverTarget === 'string') {
        target = document.querySelectorAll(`${coverTarget}`)[0] as HTMLElement
      }
      if (coverTarget instanceof HTMLElement) {
        target = coverTarget
      }
      return target
    }, [coverTarget])

    const playVideo = useCallback(async () => {
      if (!videoRef.current || !videoSrc) return
      if (videoRef.current.paused && !isPlayingRef.current) {
        videoRef.current.src = ''
        await videoRef.current.load()
        videoRef.current.src = videoSrc
        await videoRef.current.load()
        videoRef.current.currentTime = 0
        await videoRef.current.play()
        isPlayingRef.current = true

        if (isReducedMotion) {
          videoRef.current.currentTime = 0.5
          await videoRef.current.pause()
        }
      }
    }, [videoSrc, isReducedMotion])

    const loadVideo = useCallback(async () => {
      if (!videoRef.current || !videoSrc) return
      if (videoRef.current.paused && !isPlayingRef.current) {
        videoRef.current.src = ''
        await videoRef.current.load()
        videoRef.current.src = videoSrc
        await videoRef.current.load()
      }
    }, [videoSrc])

    const stopVideo = useCallback(async () => {
      if (!videoRef.current) return
      if (!videoRef.current.paused && isPlayingRef.current) {
        await videoRef.current.pause()
        videoRef.current.src = ''
        await videoRef.current.load()
        isPlayingRef.current = false
      }
    }, [])

    useEffect(() => {
      if (initiallyStopped) {
        return
      }

      if (isIncompatable) {
        playVideo()
        return
      }

      const fire = async () => {
        if (!videoRef.current) return

        if (isInView || disableInView) {
          playVideo()
        } else {
          stopVideo()
        }
      }

      fire()
    }, [videoSrc, isInView, disableInView, playVideo, stopVideo, isIncompatable, initiallyStopped])

    useEffect(() => {
      if (isIncompatable) {
        setShowVideo(true)
        return
      }

      if (!disableInView) {
        const coverTargetElement = getCoverTargetElement()
        if (coverTarget && coverTargetElement) {
          setElementToObserve(coverTargetElement)
        } else {
          setElementToObserve(videoRef.current)
        }
      }

      if (intervalRef.current) clearInterval(intervalRef.current)

      if (disableInView) {
        setShowVideo(true)
      }

      if (initiallyStopped) {
        setShowVideo(true)
        return
      }

      if (!isInView) return

      intervalRef.current = setInterval(() => {
        if (!videoRef.current) {
          return
        }
        if (videoRef.current?.currentTime > 0) {
          setShowVideo(true)
          if (onShow) onShow()
          if (intervalRef.current) clearInterval(intervalRef.current)
        } else {
          setShowVideo(false)
        }
      }, videoIntervalCheckMs)
    }, [
      onShow,
      videoSrc,
      isInView,
      disableInView,
      setElementToObserve,
      isIncompatable,
      videoIntervalCheckMs,
      initiallyStopped,
      getCoverTargetElement,
      coverTarget,
    ])

    useEffect(() => {
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, [])

    useEffect(() => {
      if (!coverTarget) return
      const target = getCoverTargetElement()
      if (!target) return
      setCoverTargetDimensions({ w: target.offsetWidth, h: target.offsetHeight })
    }, [
      coverTarget,
      resizeKey,
      videoSrc,
      desktopLoop,
      mobileLoop,
      isMobile,
      setElementToObserve,
      getCoverTargetElement,
    ])

    useEffect(() => {
      if (!coverTargetDimensions.w || !coverTargetDimensions.h || !dimensions.w || !dimensions.h) {
        return
      }

      const coverRatio = coverTargetDimensions.w / coverTargetDimensions.h
      const videoRatio = dimensions.w / dimensions.h

      let width = 0
      let height = 0
      let leftOffset = 0
      let topOffset = 0

      if (coverRatio > videoRatio) {
        width = coverTargetDimensions.w
        height = coverTargetDimensions.w / videoRatio
        topOffset = (height - coverTargetDimensions.h) * 0.5 * -1
      }

      if (coverRatio <= videoRatio) {
        height = coverTargetDimensions.h
        width = height * videoRatio
        leftOffset = (width - coverTargetDimensions.w) * 0.5 * -1
      }

      setCalculatedOffsets({
        w: width,
        h: height,
        leftOffset,
        topOffset,
      })
    }, [coverTargetDimensions.w, coverTargetDimensions.h, dimensions.w, dimensions.h, resizeKey, isMobile, videoSrc])

    useImperativeHandle(ref, () => ({
      getElement: () => {
        return videoRef.current
      },
      forceIsPlaying: (value: boolean) => {
        isPlayingRef.current = value
      },
      playVideo,
      stopVideo,
      loadVideo,
    }))

    if (!desktopLoop || !mobileLoop || !videoSrc) return null

    return (
      <>
        {describedByIdRef.current && altText && (
          <p
            id={describedByIdRef.current}
            className={styles.describedByText}
          >
            {altText}
          </p>
        )}
        <video
          onCanPlay={() => {
            if (onCanPlay) onCanPlay()
          }}
          {...(altText && describedByIdRef.current ? { 'aria-describedby': describedByIdRef.current } : {})}
          ref={videoRef}
          muted
          playsInline
          loop
          onLoadedMetadata={() => {
            if (!videoRef.current) return
            setDimensions({ w: videoRef.current.videoWidth, h: videoRef.current.videoHeight })
            if (onLoadedMetadata) onLoadedMetadata()
          }}
          className={classNames(
            styles.video,
            className,
            {
              [styles.visuallyShowVideo]: showVideo,
            },
            {
              [styles.coverTargetDimensions]:
                coverTargetDimensions.h &&
                coverTargetDimensions.w &&
                ((isMobile && isMobile !== null) || DESKTOP_DEBUG),
            },
          )}
          onPlaying={() => {
            isPlayingRef.current = true
          }}
          onPause={() => {
            isPlayingRef.current = false
          }}
          id={id}
          style={
            {
              '--video-show-duration': videoShowDuration,
              '--video-width': `${calculatedOffsets.w}px`,
              '--video-height': `${calculatedOffsets.h}px`,
              '--video-top-offset': `${calculatedOffsets.topOffset}px`,
              '--video-left-offset': `${calculatedOffsets.leftOffset}px`,
            } as CSSProperties
          }
        />
      </>
    )
  },
)

VideoLoop.displayName = 'VideoLoop'

export default VideoLoop
