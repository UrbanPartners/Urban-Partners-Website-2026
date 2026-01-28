'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import classNames from 'classnames'
import Hls from 'hls.js'
import styles from './VideoPlayer.module.scss'

export interface VideoPlayerProps {
  src: string
  autoplay?: boolean
  looped?: boolean
  muted?: boolean
  controls?: boolean
  className?: string
  width?: string | number
  height?: string | number
  minQuality?: number // Minimum quality level (0 = lowest, higher = better)
  maxQuality?: number // Maximum quality level
  startLevel?: number // Starting quality level
  playsinline?: boolean
  forceMp4?: boolean
  onCanPlay?: () => void // Callback when video can be played
  onLoadedMetadata?: () => void // Callback when video metadata is loaded
  onReady?: () => void // Callback when component is mounted on client
  onPlay?: () => void // Callback when video is played
  onPause?: () => void // Callback when video is paused
}

export interface VideoPlayerRef {
  play: () => void
  pause: () => void
  stop: () => void
  destroy: () => void
  getElement: () => HTMLVideoElement | null
  getHlsInstance: () => any | null
  setQuality: (level: number) => void
  getPlayerRef: () => ReactPlayer | null
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (
    {
      src,
      autoplay = false,
      looped = false,
      muted = false,
      controls = true,
      className,
      width = '100%',
      height = 'auto',
      playsinline = true,
      forceMp4 = false,
      // minQuality = 0,
      // maxQuality = -1, // -1 means auto (highest available)
      // startLevel = -1, // -1 means auto
      minQuality = 3,
      maxQuality = 3, // -1 means auto (highest available)
      startLevel = 3, // -1 means auto
      onCanPlay,
      onLoadedMetadata,
      onReady,
      onPlay,
      onPause,
    },
    ref,
  ) => {
    const playerRef = useRef<ReactPlayer>(null)
    const hlsRef = useRef<any | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [isDestroyed, setIsDestroyed] = useState(false)
    const [isHlsSupported, setIsHlsSupported] = useState<boolean | null>(null)
    const [isClient, setIsClient] = useState(false)
    const qualityForcedRef = useRef(false)

    // Set client-side flag
    useEffect(() => {
      setIsClient(true)
    }, [])

    // Check if HLS is supported and initialize
    useEffect(() => {
      if (!isClient || forceMp4) {
        return
      }

      const isHlsUrl = src.includes('.m3u8') || src.includes('hls')
      const hlsSupported = Hls.isSupported()

      // Check for native HLS support (Safari, iOS Safari, etc.)
      const video = document.createElement('video')
      const hasNativeHlsSupport =
        video.canPlayType('application/vnd.apple.mpegurl') === 'probably' ||
        video.canPlayType('application/vnd.apple.mpegurl') === 'maybe'

      // Check if quality control is needed
      const needsQualityControl = startLevel >= 0 || minQuality >= 0 || maxQuality >= 0

      // For Safari: use HLS.js if quality control is needed, otherwise use native support
      const shouldUseHls = isHlsUrl && (hlsSupported || (hasNativeHlsSupport && needsQualityControl))

      setIsHlsSupported(shouldUseHls)

      if (isHlsUrl && hlsSupported) {
        const hls = new Hls({
          // HLS.js configuration for better buffering
          maxBufferLength: 30, // Maximum buffer length in seconds
          maxMaxBufferLength: 60, // Maximum buffer length when seeking
          maxBufferSize: 60 * 1000 * 1000, // Maximum buffer size in bytes (60MB)
          maxBufferHole: 0.1, // Maximum buffer hole in seconds
          lowLatencyMode: false, // Disable low latency mode for better buffering
          backBufferLength: 90, // Keep 90 seconds of back buffer
          maxLoadingDelay: 4, // Maximum loading delay in seconds
          startLevel: startLevel >= 0 ? startLevel : -1, // Starting quality level
          capLevelToPlayerSize: false, // Don't cap level to player size
          debug: false, // Disable debug logging
          // Disable automatic bitrate adaptation to force quality
          abrEwmaFastLive: 1.0, // Very fast adaptation
          abrEwmaSlowLive: 1.0, // Very fast adaptation
          abrMaxWithRealBitrate: false, // Don't limit based on real bitrate
          maxStarvationDelay: 1, // Very short delay before switching down
          // Force specific quality if startLevel is set
          ...(startLevel >= 0 && {
            startLevel: startLevel,
            capLevelToPlayerSize: false,
            abrEwmaFastLive: 0.1,
            abrEwmaSlowLive: 0.1,
          }),
        })

        hlsRef.current = hls

        // Set up HLS event listeners
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // console.log(
          //   'Available levels:',
          //   hls.levels.map((level, index) => `${index}: ${level.height}p @ ${level.bitrate}kbps`),
          // )

          // Set quality constraints based on actual levels
          if (minQuality >= 0 && minQuality < hls.levels.length) {
            // Update the config to set minimum auto bitrate
            hls.config.minAutoBitrate = hls.levels[minQuality].bitrate
          }

          if (maxQuality >= 0 && maxQuality < hls.levels.length) {
            // Set max auto level using autoLevelCapping
            hls.autoLevelCapping = maxQuality
          }

          // Force starting level if specified
          if (startLevel >= 0 && startLevel < hls.levels.length) {
            hls.startLevel = startLevel
            hls.currentLevel = startLevel

            // Set the flag to prevent repeated corrections
            qualityForcedRef.current = true
            setTimeout(() => {
              qualityForcedRef.current = false
            }, 1000)
          }
        })

        hls.on(Hls.Events.LEVEL_SWITCHED, (_: any, data: any) => {
          // Force back to desired level if it switched away (but only if we haven't already forced it)
          if (startLevel >= 0 && data.level !== startLevel && !qualityForcedRef.current) {
            qualityForcedRef.current = true
            setTimeout(() => {
              hls.currentLevel = startLevel
              qualityForcedRef.current = false
            }, 100)
          }
        })

        // Only force quality level once when media is attached
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          if (
            startLevel >= 0 &&
            startLevel < hls.levels.length &&
            hls.currentLevel !== startLevel &&
            !qualityForcedRef.current
          ) {
            qualityForcedRef.current = true
            hls.currentLevel = startLevel
            setTimeout(() => {
              qualityForcedRef.current = false
            }, 500)
          }
        })

        hls.on(Hls.Events.ERROR, (_: any, data: any) => {
          console.error('HLS error:', data)
          if (data.fatal) {
            if (!Hls) {
              console.error('Hls is not available')
              return
            }
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Fatal network error, trying to recover...')
                hls.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Fatal media error, trying to recover...')
                hls.recoverMediaError()
                break
              default:
                console.error('Fatal error, destroying HLS...')
                hls.destroy()
                break
            }
          }
        })
      }

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy()
          hlsRef.current = null
        }
      }
    }, [isClient, src, minQuality, maxQuality, startLevel, forceMp4])

    useImperativeHandle(ref, () => ({
      play: () => {
        if (!isDestroyed && playerRef.current) {
          // Force play by setting internal state if needed
          const player = playerRef.current.getInternalPlayer()
          if (player && typeof player.play === 'function') {
            player.play()
          }
        }
      },
      pause: () => {
        if (!isDestroyed && playerRef.current) {
          const player = playerRef.current.getInternalPlayer()
          if (player && typeof player.pause === 'function') {
            player.pause()
          }
        }
      },
      stop: () => {
        if (!isDestroyed && playerRef.current) {
          playerRef.current.seekTo(0)
          const player = playerRef.current.getInternalPlayer()
          if (player && typeof player.pause === 'function') {
            player.pause()
          }
        }
      },
      destroy: () => {
        if (hlsRef.current) {
          hlsRef.current.destroy()
          hlsRef.current = null
        }
        if (playerRef.current) {
          const player = playerRef.current.getInternalPlayer()
          if (player) {
            if (typeof player.pause === 'function') {
              player.pause()
            }
            if (typeof player.remove === 'function') {
              player.remove()
            }
            if (typeof player.destroy === 'function') {
              player.destroy()
            }
          }
          setIsDestroyed(true)
        }
      },
      getPlayerRef: () => {
        return playerRef.current
      },
      getElement: () => {
        if (!isDestroyed && playerRef.current) {
          return playerRef.current.getInternalPlayer() as HTMLVideoElement
        }
        return videoRef.current
      },
      getHlsInstance: () => {
        return hlsRef.current
      },
      setQuality: (level: number) => {
        if (hlsRef.current && level >= 0 && level < hlsRef.current.levels.length) {
          hlsRef.current.currentLevel = level
        }
      },
    }))

    // Handle video element reference for HLS.js
    const handleVideoRef = (video: HTMLVideoElement | null) => {
      if (forceMp4) return

      videoRef.current = video

      // Only attach HLS.js if we have an HLS stream and HLS.js is available
      if (isHlsSupported && hlsRef.current && video) {
        hlsRef.current.attachMedia(video)
        hlsRef.current.loadSource(src)
        // Force quality level immediately after attaching
        if (startLevel >= 0) {
          setTimeout(() => {
            if (hlsRef.current && hlsRef.current.levels && startLevel < hlsRef.current.levels.length) {
              hlsRef.current.currentLevel = startLevel
            }
          }, 200)
        }
      } else if (isHlsSupported && !hlsRef.current && video) {
        // Native HLS support (Safari) - just set the src directly
        // console.log('Using native HLS support (Safari) - quality control props will be ignored')
        video.src = src
      } else {
        // eslint-disable-next-line no-console
        console.warn('Not attaching HLS:', { isHlsSupported, hlsRef: !!hlsRef.current, video: !!video })
      }
    }

    if (!isClient || (isHlsSupported === null && !forceMp4) || !src) return null

    // Don't render if destroyed
    if (isDestroyed) {
      return null
    }

    return (
      <div className={classNames(styles.videoPlayer, className)}>
        <ReactPlayer
          ref={playerRef}
          url={src} // Always pass URL to ReactPlayer
          width={width}
          height={height}
          playing={autoplay}
          loop={looped}
          muted={muted}
          controls={controls}
          playsinline={playsinline}
          disablePictureInPicture={true}
          config={{
            file: {
              attributes: {
                preload: 'metadata',
              },
              hlsOptions:
                isHlsSupported && !forceMp4
                  ? {
                      // Let HLS.js handle the configuration
                      enableWorker: true,
                      lowLatencyMode: false,
                    }
                  : undefined,
            },
          }}
          onReady={player => {
            // Get the video element and attach HLS.js if needed
            const videoElement = player.getInternalPlayer() as HTMLVideoElement

            if (videoElement) {
              if (onReady) {
                onReady()
              }

              handleVideoRef(videoElement)

              videoElement.addEventListener('play', () => {
                if (onPlay) {
                  onPlay()
                }
              })

              videoElement.addEventListener('pause', () => {
                if (onPause) {
                  onPause()
                }
              })

              // Add canplay event listener
              const handleCanPlay = () => {
                if (onCanPlay) {
                  onCanPlay()
                }
              }

              // Add loadedmetadata event listener
              const handleLoadedMetadata = () => {
                if (onLoadedMetadata) {
                  onLoadedMetadata()
                }
              }

              videoElement.addEventListener('play', () => {
                if (onPlay) {
                  onPlay()
                }
              })

              videoElement.addEventListener('pause', () => {
                if (onPause) {
                  onPause()
                }
              })

              videoElement.addEventListener('canplay', handleCanPlay)
              videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)

              // Cleanup event listeners when component unmounts
              return () => {
                videoElement.removeEventListener('canplay', handleCanPlay)
                videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
                videoElement.removeEventListener('play', () => {
                  if (onPlay) {
                    onPlay()
                  }
                })
                videoElement.removeEventListener('pause', () => {
                  if (onPause) {
                    onPause()
                  }
                })
              }
            } else {
              console.warn('No video element found')
            }
          }}
          onError={error => {
            console.error('VideoPlayer error:', error)
          }}
        />
      </div>
    )
  },
)

VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer
