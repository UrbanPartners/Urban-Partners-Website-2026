'use client'

import { forwardRef, useState, useRef, useEffect, useImperativeHandle, useCallback } from 'react'
import classNames from 'classnames'
import VideoPlayer, { VideoPlayerProps, VideoPlayerRef } from '@/components/VideoPlayer/VideoPlayer'
import SanityImage from '@/components/SanityImage/SanityImage'
import { SanityImage as SanityImageType } from '@/types/sanity/SanityImage'
import styles from './VideoPlayerWithControls.module.scss'
import { secondsToTimeObject } from '@/utils'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import Icon from '@/components/Icon/Icon'
import useI18n from '@/hooks/use-i18n'
import useInView from '@/hooks/use-in-view'
import gsap from 'gsap'
import useBreakpoint from '@/hooks/use-breakpoint'
import TextSwapper, { TextSwapperRef } from '@/components/TextSwapper/TextSwapper'

const CLICKED_PLAY_FADE_DURATION = 0.6

export interface VideoPlayerWithControlsProps extends Omit<VideoPlayerProps, 'className'> {
  className?: string
  previewImage?: SanityImageType
  previewOverlayOpacity?: number
  onClickedPlay?: () => void
  initiallyHideVideoAndPreviewImage?: boolean
  disabledOutOfViewPause?: boolean
  lineFullWidth?: boolean
  forceMp4?: boolean
  controlsOnMouseEnter?: () => void
  controlsOnMouseLeave?: () => void
}

export interface ControlsRef {
  playVideo: () => void
  pauseVideo: () => void
  setIsHoveringInitialPlayPause: (isHovering: boolean) => void
}

export interface VideoPlayerWithControlsRef {
  controls: ControlsRef | null
}

const VideoPlayerWithControls = forwardRef<VideoPlayerWithControlsRef, VideoPlayerWithControlsProps>(
  (
    {
      className,
      previewImage,
      previewOverlayOpacity = 0.5,
      onClickedPlay = () => {},
      initiallyHideVideoAndPreviewImage = false,
      disabledOutOfViewPause = false,
      lineFullWidth = false,
      forceMp4,
      ...videoPlayerProps
    },
    ref,
  ) => {
    const videoPlayerRef = useRef<VideoPlayerRef>(null)
    const controlsRef = useRef<ControlsRef>(null)
    const [duration, setDuration] = useState<number>(0)
    const [playerState, setPlayerState] = useState<'playing' | 'paused'>('paused')
    const [isMovingMouse, setIsMovingMouse] = useState(false)
    const [hasClickedPlay, setHasClickedPlay] = useState(false)
    const { isInView, setElementToObserve } = useInView({
      fireOnce: false,
    })
    const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [render, setRender] = useState(true)
    const prevSrcRef = useRef<string | null>(videoPlayerProps.src)
    const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
      if (!videoPlayerProps.src) return

      if (prevSrcRef.current === null) {
        prevSrcRef.current = videoPlayerProps.src
        return
      }

      if (!hasClickedPlay) return

      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current)
      }

      renderTimeoutRef.current = setTimeout(() => {
        if (prevSrcRef.current !== videoPlayerProps.src) {
          prevSrcRef.current = videoPlayerProps.src
          setRender(false)
          setDuration(0)
          setPlayerState('paused')
          setHasClickedPlay(false)

          setTimeout(() => {
            setRender(true)
          }, 100)
        }
      }, 300)

      return () => {
        if (renderTimeoutRef.current) {
          clearTimeout(renderTimeoutRef.current)
        }
      }
    }, [videoPlayerProps.src, hasClickedPlay])

    const loadedMetadata = () => {
      const videoElement = videoPlayerRef.current?.getElement()
      setDuration(videoElement?.duration || 0)
    }

    const handleMouseMove = () => {
      setIsMovingMouse(true)
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current)
      }
      mouseMoveTimeoutRef.current = setTimeout(() => {
        setIsMovingMouse(false)
      }, 600)
    }

    useImperativeHandle(ref, () => ({
      controls: controlsRef.current,
    }))

    return (
      <div
        className={classNames(styles.VideoPlayerWithControls, className)}
        ref={ref => {
          setElementToObserve(ref)
        }}
        onMouseMove={handleMouseMove}
      >
        {render && (
          <>
            <VideoPlayer
              ref={videoPlayerRef}
              {...videoPlayerProps}
              controls={false}
              autoplay={false}
              className={classNames(styles.videoPlayer, {
                [styles.initiallyHideVideoAndPreviewImage]: initiallyHideVideoAndPreviewImage && !hasClickedPlay,
              })}
              onLoadedMetadata={loadedMetadata}
              onReady={loadedMetadata}
              onPlay={() => setPlayerState('playing')}
              onPause={() => setPlayerState('paused')}
              playsinline={false}
              forceMp4={forceMp4}
            />
            <Controls
              ref={controlsRef}
              duration={duration}
              videoRef={videoPlayerRef as React.RefObject<VideoPlayerRef>}
              playerState={playerState}
              previewImage={previewImage as SanityImageType}
              previewOverlayOpacity={previewOverlayOpacity}
              isInView={isInView}
              isMovingMouseOverVideo={isMovingMouse}
              onClickedPlay={onClickedPlay}
              initiallyHideVideoAndPreviewImage={initiallyHideVideoAndPreviewImage}
              setHasClickedPlay={setHasClickedPlay}
              hasClickedPlay={hasClickedPlay}
              disabledOutOfViewPause={disabledOutOfViewPause}
              lineFullWidth={lineFullWidth}
              onMouseEnter={videoPlayerProps.controlsOnMouseEnter}
              onMouseLeave={videoPlayerProps.controlsOnMouseLeave}
            />
          </>
        )}
      </div>
    )
  },
)

VideoPlayerWithControls.displayName = 'VideoPlayerWithControls'

const Controls = forwardRef<
  ControlsRef,
  {
    duration: number
    videoRef: React.RefObject<VideoPlayerRef>
    playerState: 'playing' | 'paused'
    previewImage: SanityImageType
    previewOverlayOpacity: number
    isInView: boolean
    isMovingMouseOverVideo: boolean
    onClickedPlay: () => void
    setHasClickedPlay: (hasClickedPlay: boolean) => void
    hasClickedPlay: boolean
    initiallyHideVideoAndPreviewImage: boolean
    disabledOutOfViewPause: boolean
    lineFullWidth: boolean
    onMouseEnter?: () => void
    onMouseLeave?: () => void
  }
>(
  (
    {
      duration,
      videoRef,
      playerState,
      previewImage,
      previewOverlayOpacity,
      isInView,
      isMovingMouseOverVideo,
      initiallyHideVideoAndPreviewImage = false,
      setHasClickedPlay,
      hasClickedPlay,
      onClickedPlay = () => {},
      disabledOutOfViewPause = false,
      lineFullWidth = false,
      onMouseEnter,
      onMouseLeave,
    },
    ref,
  ) => {
    const { i18n } = useI18n()
    const playTextRef = useRef<HTMLSpanElement>(null)
    const currentTimeIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const bufferedTimeLineRef = useRef<HTMLDivElement | null>(null)
    const currentBufferedIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const currentTimeLineRef = useRef<HTMLDivElement | null>(null)
    const [hideControls, setHideControls] = useState(false)
    const [isHoveringControls, setIsHoveringControls] = useState(false)
    const hoverDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const controlsOverlayRef = useRef<HTMLButtonElement | null>(null)
    const currentTimeLineContainerRef = useRef<HTMLDivElement | null>(null)
    const seekingTimeLineRef = useRef<HTMLDivElement | null>(null)
    const seekingTimeLineTickRef = useRef<HTMLDivElement | null>(null)
    const seekingPercentRef = useRef<number>(0)
    const hasHours = secondsToTimeObject(duration).hours > 0
    const [renderInitialPlayPause, setRenderInitialPlayPause] = useState(true)
    const [isMuted, setIsMuted] = useState(false)
    const initialPlayPauseContainerRef = useRef<HTMLButtonElement | null>(null)
    const leftContainerRef = useRef<HTMLDivElement | null>(null)
    const volumeSliderBarFillRef = useRef<HTMLDivElement | null>(null)
    const volumeSliderBarRef = useRef<HTMLDivElement | null>(null)
    const currentVolumeRef = useRef<number>(1)
    const isSeekingRef = useRef<boolean>(false)
    const { isMobile } = useBreakpoint()
    const [isHoveringInitialPlayPause, setIsHoveringInitialPlayPause] = useState(false)
    const textSwapperRef = useRef<TextSwapperRef>(null)

    const getVideoProgressPercent = useCallback(() => {
      const videoElement = videoRef.current?.getElement()
      if (videoElement) {
        return videoElement.currentTime / duration
      } else {
        return 0
      }
    }, [duration, videoRef])

    const setVolumeSliderBar = (percent: number) => {
      if (!volumeSliderBarFillRef.current) return
      gsap.set(volumeSliderBarFillRef.current, {
        width: `${percent * 100}%`,
      })
    }

    const updateTickerPosition = (percent: number) => {
      if (!seekingTimeLineTickRef.current) return
      gsap.set(seekingTimeLineTickRef.current, {
        left: `${percent * 100}%`,
      })
    }

    useEffect(() => {
      const videoElement = videoRef.current?.getElement()
      if (!videoElement) return

      if (isMuted) {
        videoElement.volume = 0
        setVolumeSliderBar(0)
      } else {
        videoElement.volume = currentVolumeRef.current
        setVolumeSliderBar(currentVolumeRef.current)
      }
    }, [isMuted, videoRef])

    useEffect(() => {
      const showControls = playerState === 'paused' || isHoveringControls || isMovingMouseOverVideo || !hasClickedPlay
      const debounceTime = showControls ? 0 : 600
      let _hideControls = true

      if (showControls) {
        _hideControls = false
      }

      if (hoverDebounceTimeoutRef.current) {
        clearTimeout(hoverDebounceTimeoutRef.current)
      }

      hoverDebounceTimeoutRef.current = setTimeout(() => {
        setHideControls(_hideControls)
      }, debounceTime)
    }, [playerState, isHoveringControls, hasClickedPlay, isMovingMouseOverVideo])

    useEffect(() => {
      if (controlsOverlayRef.current) {
        gsap.killTweensOf(controlsOverlayRef.current)
        gsap.to(controlsOverlayRef.current, {
          opacity: hideControls ? 0 : 1,
          duration: 0.3,
        })
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hideControls, renderInitialPlayPause])

    // Detect when video is playing and update currentTime every 300ms
    useEffect(() => {
      if (currentTimeIntervalRef.current) {
        clearInterval(currentTimeIntervalRef.current)
      }

      if (!disabledOutOfViewPause) {
        if (!isInView || playerState !== 'playing') {
          return
        }
      }

      currentTimeIntervalRef.current = setInterval(() => {
        const videoElement = videoRef.current?.getElement()
        if (videoElement) {
          setCurrentTime(videoElement.currentTime)
          const currentProgressPercent = getVideoProgressPercent()
          gsap.set(currentTimeLineRef.current, {
            width: `${currentProgressPercent * 100}%`,
          })

          if (!isSeekingRef.current) {
            updateTickerPosition(currentProgressPercent)
          }
        }
      }, 200)

      const int = currentTimeIntervalRef.current

      return () => {
        clearInterval(int)
      }
    }, [playerState, isInView, duration, videoRef, disabledOutOfViewPause, getVideoProgressPercent])

    // Calculate and log final end time buffered
    useEffect(() => {
      if (currentBufferedIntervalRef.current) {
        clearInterval(currentBufferedIntervalRef.current)
      }

      if (!isInView) {
        return
      }

      currentBufferedIntervalRef.current = setInterval(() => {
        const videoElement = videoRef.current?.getElement()
        if (videoElement && videoElement.buffered.length > 0) {
          const finalEndTime = videoElement.buffered.end(videoElement.buffered.length - 1)

          if (bufferedTimeLineRef.current) {
            gsap.set(bufferedTimeLineRef.current, {
              width: `${(finalEndTime / duration) * 100}%`,
            })
          }
        }
      }, 200)

      const int = currentBufferedIntervalRef.current

      return () => {
        clearInterval(int)
      }
    }, [isInView, duration, videoRef])

    const playVideo = () => {
      if (initialPlayPauseContainerRef.current) {
        gsap.killTweensOf(initialPlayPauseContainerRef.current)
        gsap.to(initialPlayPauseContainerRef.current, {
          opacity: 0,
          duration: CLICKED_PLAY_FADE_DURATION,
          ease: 'Power3.easeOut',
          onComplete: () => {
            setRenderInitialPlayPause(false)
          },
        })
      }

      setHasClickedPlay(true)

      if (onClickedPlay) {
        onClickedPlay()
      }
      if (videoRef.current) {
        videoRef.current.play()
      }
    }

    const pauseVideo = () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }

    useEffect(() => {
      if (disabledOutOfViewPause) return
      if (isInView && hasClickedPlay) return
      pauseVideo()

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInView, hasClickedPlay, disabledOutOfViewPause])

    const handlePlayPauseClick = () => {
      if (videoRef.current) {
        if (playerState === 'playing') {
          pauseVideo()
        } else {
          playVideo()
        }
      }
    }

    useEffect(() => {
      if (!renderInitialPlayPause && leftContainerRef.current) {
        gsap.killTweensOf(leftContainerRef.current)
        gsap.to(leftContainerRef.current, {
          opacity: 1,
          duration: CLICKED_PLAY_FADE_DURATION,
          ease: 'Power3.easeOut',
        })
      }
    }, [renderInitialPlayPause])

    const handleSliderMouseMove = (
      e: React.MouseEvent<HTMLDivElement>,
      hoverElement: HTMLElement | null,
      scaleElement: HTMLElement | null,
      callback: (percent: number) => void,
    ) => {
      if (!hoverElement) return

      const rect = hoverElement.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const percent = Math.max(0, Math.min(1, mouseX / rect.width))

      if (scaleElement) {
        gsap.set(scaleElement, {
          width: `${percent * 100}%`,
        })
      }

      callback(percent)
    }

    const handleCurrentTimeLineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hasClickedPlay) return
      isSeekingRef.current = true
      handleSliderMouseMove(e, currentTimeLineContainerRef.current, seekingTimeLineRef.current, percent => {
        updateTickerPosition(percent)
        gsap.set(currentTimeLineRef.current, {
          opacity: 0,
        })
        seekingPercentRef.current = percent
      })
    }

    const handleCurrentTimeLineMouseLeave = () => {
      if (!hasClickedPlay) return
      isSeekingRef.current = false
      if (!currentTimeLineContainerRef.current) return
      gsap.set(currentTimeLineRef.current, {
        opacity: 1,
      })
      gsap.set(seekingTimeLineRef.current, {
        width: 0,
      })

      const currentProgressPercent = getVideoProgressPercent()
      updateTickerPosition(currentProgressPercent)

      seekingPercentRef.current = currentProgressPercent
    }

    const handleCurrentTimelineClick = () => {
      if (!videoRef.current) return
      const playerRef = videoRef.current.getPlayerRef()
      if (!playerRef) return
      const timeToFind = Math.floor(duration * seekingPercentRef.current)
      playerRef.seekTo(timeToFind)
      videoRef.current.play()
      gsap.set(seekingTimeLineTickRef.current, {
        left: `${seekingPercentRef.current * 100}%`,
      })
      seekingPercentRef.current = 0
    }
    const handleVolumeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      handleSliderMouseMove(e, volumeSliderBarRef.current, volumeSliderBarFillRef.current, () => {})
    }

    const handleVolumeMouseLeave = () => {
      const volumeToSet = isMuted ? 0 : currentVolumeRef.current
      setVolumeSliderBar(volumeToSet)
    }

    const handleVolumeMouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
      handleSliderMouseMove(e, volumeSliderBarRef.current, volumeSliderBarFillRef.current, percent => {
        const videoElement = videoRef.current?.getElement()
        if (videoElement) {
          setIsMuted(percent === 0)
          currentVolumeRef.current = percent
          videoElement.volume = currentVolumeRef.current
        }
      })
    }

    const handleVolumeButtonClick = () => {
      setIsMuted(!isMuted)
    }

    useImperativeHandle(ref, () => ({
      playVideo,
      pauseVideo,
      setIsHoveringInitialPlayPause,
      isHoveringInitialPlayPause,
    }))

    if (!duration || !videoRef.current) return null

    return (
      <>
        {!hasClickedPlay && !initiallyHideVideoAndPreviewImage && (
          <div
            className={styles.previewContainer}
            onClick={playVideo}
          >
            <div
              className={styles.previewOverlay}
              style={{ opacity: previewOverlayOpacity / 100 }}
            />
            {previewImage && (
              <SanityImage
                source={previewImage}
                className={styles.previewImage}
              />
            )}
          </div>
        )}

        <button
          className={styles.controlsOverlay}
          ref={controlsOverlayRef}
          aria-label={playerState === 'playing' ? i18n('pauseVideo') : i18n('playVideo')}
          onClick={handlePlayPauseClick}
          onMouseEnter={() => {
            setIsHoveringInitialPlayPause(true)
            if (onMouseEnter) {
              onMouseEnter()
            }
          }}
          onMouseLeave={() => {
            setIsHoveringInitialPlayPause(false)
            if (onMouseLeave) {
              onMouseLeave()
            }
          }}
        />
        <div
          className={classNames(
            styles.controls,
            { [styles.hideControls]: hideControls },
            { [styles.hasClickedPlay]: hasClickedPlay },
            {
              [styles.lineFullWidth]: lineFullWidth,
            },
          )}
          onMouseEnter={() => setIsHoveringControls(true)}
          onMouseLeave={() => setIsHoveringControls(false)}
        >
          <div className={styles.controlsInner}>
            <LineAnimation
              position={isMobile ? 'bottom' : 'top'}
              animateFrom="left"
              startFull
              className={styles.durationLine}
            />
            <div
              className={styles.currentTimeLineContainer}
              ref={currentTimeLineContainerRef}
              onMouseMove={handleCurrentTimeLineMouseMove}
              onMouseLeave={handleCurrentTimeLineMouseLeave}
              onClick={handleCurrentTimelineClick}
            >
              <div
                className={styles.currentTimeLine}
                ref={currentTimeLineRef}
              />
              <div
                className={styles.seekingTimeLine}
                ref={seekingTimeLineRef}
              />
              <div
                className={styles.seekingTimeLineTick}
                ref={seekingTimeLineTickRef}
              />
              <div
                className={styles.bufferedTimeLine}
                ref={bufferedTimeLineRef}
              />
            </div>

            <div
              className={styles.leftContainer}
              ref={leftContainerRef}
            >
              {!renderInitialPlayPause && (
                <>
                  <button
                    className={styles.playPauseButton}
                    aria-label={playerState === 'playing' ? i18n('pauseVideo') : i18n('playVideo')}
                    onClick={handlePlayPauseClick}
                  >
                    <Icon
                      name={playerState === 'playing' ? 'pause' : 'play'}
                      className={styles.playPause__icon}
                    />
                  </button>
                  <div className={styles.volumeContainer}>
                    <button
                      className={styles.volumeButton}
                      onClick={handleVolumeButtonClick}
                    >
                      <Icon
                        name={isMuted ? 'volumeMuted' : 'volume'}
                        className={styles.volume__icon}
                      />
                    </button>
                    <div
                      className={styles.volumeSlider}
                      onMouseMove={handleVolumeMouseMove}
                      onMouseLeave={handleVolumeMouseLeave}
                      onClick={handleVolumeMouseClick}
                    >
                      <div
                        className={styles.volumeSlider__bar}
                        ref={volumeSliderBarRef}
                      >
                        <div
                          className={styles.volumeSlider__bar__fill}
                          ref={volumeSliderBarFillRef}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {renderInitialPlayPause && (
              <button
                className={classNames(styles.initialPlayPauseContainer, {
                  [styles.isHoveringInitialPlayPause]: isHoveringInitialPlayPause,
                })}
                ref={initialPlayPauseContainerRef}
                onClick={playVideo}
                onMouseEnter={() => {
                  textSwapperRef.current?.swapText()
                  setIsHoveringInitialPlayPause(true)
                }}
                onMouseLeave={() => setIsHoveringInitialPlayPause(false)}
              >
                <span className={styles.initialPlayPauseContainer__translucentLayer} />
                <LineAnimation
                  position={isMobile ? 'right' : 'left'}
                  animateFrom="top"
                  startFull
                  className={styles.initialPlayPauseContainer__playPauseLine}
                />
                <Icon
                  name={playerState === 'playing' ? 'pause' : 'play'}
                  className={styles.playPause__icon}
                />
                <p className={styles.initialPlayPauseContainerText}>
                  <span
                    ref={playTextRef}
                    aria-hidden={playerState === 'playing'}
                    className={styles.initialPlayPauseContainerText__textPlay}
                  >
                    <TextSwapper
                      label={i18n('playVideo')}
                      ref={textSwapperRef}
                    />
                  </span>
                </p>
              </button>
            )}

            <div className={styles.durationTotal}>
              {hasClickedPlay && <span>-</span>}
              {hasHours && <>{secondsToTimeObject(duration - currentTime, true).hours}:</>}
              {secondsToTimeObject(duration - currentTime, true).minutes}:
              {secondsToTimeObject(duration - currentTime, true).seconds}
            </div>
          </div>
        </div>
      </>
    )
  },
)

Controls.displayName = 'Controls'

export default VideoPlayerWithControls
