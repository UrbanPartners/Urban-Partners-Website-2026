'use client'

import useInView from '@/hooks/use-in-view'
import classNames from 'classnames'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import styles from './VideoLoopV2.module.scss'
import VideoPlayer, { type VideoPlayerRef } from '@/components/VideoPlayer/VideoPlayer'

export interface VideoLoopV2Props {
  src: string
  className?: string
  autoplay?: boolean
  looped?: boolean
  muted?: boolean
  controls?: boolean
  minQuality?: number
  maxQuality?: number
  startLevel?: number
  disableInView?: boolean
  initiallyStopped?: boolean
  forceMp4?: boolean
  onShow?: () => void
  onCanPlay?: () => void
  onLoadedMetadata?: () => void
  onReady?: () => void
}

export interface VideoLoopV2ImperativeHandle {
  getElement: () => HTMLVideoElement | null
  forceIsPlaying: (value: boolean) => void
  playVideo: () => Promise<void>
  stopVideo: () => Promise<void>
  getVideoPlayerRef: () => VideoPlayerRef | null
}

const VideoLoopV2 = React.forwardRef<VideoLoopV2ImperativeHandle, VideoLoopV2Props>(
  (
    {
      src,
      className,
      autoplay = true,
      looped = true,
      muted = true,
      controls = false,
      minQuality = -1,
      maxQuality = -1,
      startLevel = -1,
      disableInView = false,
      initiallyStopped = false,
      forceMp4 = false,
      onReady,
      onShow,
      onCanPlay,
      onLoadedMetadata,
    },
    ref,
  ) => {
    const videoPlayerRef = useRef<VideoPlayerRef>(null)
    const isPlayingRef = useRef(false)
    const [showVideo, setShowVideo] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [isMounted, setIsMounted] = useState(false)
    // const { isMobile } = useBreakpoint()

    // const qualitySettings = useMemo(() => {
    //   let defaults = {
    //     minQuality: -1,
    //     maxQuality: -1,
    //     startLevel: -1,
    //   }

    //   if (isMobile) {
    //     defaults = {
    //       minQuality: 1,
    //       maxQuality: 1,
    //       startLevel: 1,
    //     }
    //   }

    //   return {
    //     minQuality: minQuality || defaults.minQuality,
    //     maxQuality: maxQuality || defaults.maxQuality,
    //     startLevel: startLevel || defaults.startLevel,
    //   }
    // }, [minQuality, maxQuality, startLevel, isMobile])

    const { setElementToObserve, isInView } = useInView({
      fireOnce: false,
      scrolltriggerStart: 'top-=1200px bottom',
      scrolltriggerEnd: 'bottom+=200px top',
    })

    // Handle inView logic
    useEffect(() => {
      if (initiallyStopped) {
        return
      }

      const fire = async () => {
        if (!videoPlayerRef.current) return

        if (isInView || disableInView) {
          await videoPlayerRef.current.play()
          isPlayingRef.current = true
        } else {
          await videoPlayerRef.current.pause()
          isPlayingRef.current = false
        }
      }

      fire()
    }, [src, isInView, disableInView, initiallyStopped])

    // Handle show video logic
    useEffect(() => {
      if (!isMounted) return

      if (!disableInView) {
        setElementToObserve(videoPlayerRef.current?.getElement() || null)
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
        const videoElement = videoPlayerRef.current?.getElement()
        if (!videoElement) {
          console.warn('No video element found')
          return
        }
        if (videoElement.currentTime > 0) {
          setShowVideo(true)
          if (onShow) onShow()
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
        // else {
        //     setShowVideo(false)
        //   }
      }, 20) // Same interval as original VideoLoop
    }, [onShow, src, isInView, disableInView, setElementToObserve, initiallyStopped, isMounted])

    // Cleanup interval on unmount
    useEffect(() => {
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, [])

    useImperativeHandle(ref, () => ({
      getElement: () => {
        return videoPlayerRef.current?.getElement() || null
      },
      forceIsPlaying: (value: boolean) => {
        isPlayingRef.current = value
      },
      playVideo: async () => {
        if (videoPlayerRef.current) {
          await videoPlayerRef.current.play()
          isPlayingRef.current = true
        }
      },
      stopVideo: async () => {
        if (videoPlayerRef.current) {
          await videoPlayerRef.current.pause()
          isPlayingRef.current = false
        }
      },
      getVideoPlayerRef: () => {
        return videoPlayerRef.current
      },
    }))

    if (!src) return null

    return (
      <div className={classNames(styles.videoLoopV2, className)}>
        <VideoPlayer
          onReady={() => {
            if (onReady) {
              onReady()
            }
            setIsMounted(true)
          }}
          ref={videoPlayerRef}
          src={src}
          autoplay={autoplay}
          looped={looped}
          muted={muted}
          controls={controls}
          minQuality={minQuality}
          maxQuality={maxQuality}
          startLevel={startLevel}
          className={classNames(styles.videoPlayer, {
            [styles.visuallyShowVideo]: showVideo,
          })}
          height="100%"
          onCanPlay={onCanPlay}
          onLoadedMetadata={onLoadedMetadata}
          forceMp4={forceMp4}
        />
      </div>
    )
  },
)

VideoLoopV2.displayName = 'VideoLoopV2'

export default VideoLoopV2
