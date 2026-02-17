'use client'

import { CSSProperties, forwardRef, useImperativeHandle, useRef } from 'react'
import SanityImage from '@/components/SanityImage/SanityImage'
import { SanityImage as SanityImageType } from '@/types/sanity/SanityImage'
import styles from './MediaSectionBackgroundImage.module.scss'
import { ControlsRef } from '@/components/VideoPlayerWithControls/VideoPlayerWithControls'
import classNames from 'classnames'

export interface MediaSectionBackgroundImageRef {
  getElement: () => HTMLButtonElement | null
}

interface MediaSectionBackgroundImageProps {
  image: SanityImageType
  overlay: number
  className?: string
  controlsRef: ControlsRef | null
  setClickedPlay: (clickedPlay: boolean) => void
  isVideoPlayer: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const MediaSectionBackgroundImage = forwardRef<MediaSectionBackgroundImageRef, MediaSectionBackgroundImageProps>(
  ({ image, overlay, className, controlsRef, setClickedPlay, isVideoPlayer, onMouseEnter, onMouseLeave }, ref) => {
    const containerRef = useRef<HTMLButtonElement | null>(null)

    useImperativeHandle(ref, () => ({
      getElement: () => containerRef.current,
    }))

    return (
      <button
        ref={containerRef}
        className={classNames(styles.container, { [styles.videoPlayer]: isVideoPlayer }, className)}
        style={
          {
            '--overlay-darkness': overlay / 100,
          } as CSSProperties
        }
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={() => {
          if (!isVideoPlayer) return
          if (controlsRef) {
            setClickedPlay(true)
            controlsRef.playVideo()
          }
        }}
      >
        <SanityImage
          source={image}
          className={styles.image}
          columns={12}
          aspectRatio={{
            tablet: 16 / 9,
            xs: 1 / 2,
          }}
          preload
        />
        <div className={styles.overlay} />
      </button>
    )
  },
)

MediaSectionBackgroundImage.displayName = 'MediaSectionBackgroundImage'

export default MediaSectionBackgroundImage
