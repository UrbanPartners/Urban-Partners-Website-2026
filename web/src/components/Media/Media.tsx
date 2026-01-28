import { forwardRef, useMemo, useState } from 'react'
import SanityImage from '@/components/SanityImage/SanityImage'
import classNames from 'classnames'
import styles from './Media.module.scss'
import VideoLoopV2, { VideoLoopV2Props, VideoLoopV2ImperativeHandle } from '@/components/VideoLoopV2/VideoLoopV2'
import { ImageProps } from '@/types/sanity/SanityImage'
import VideoPlayerWithControls, {
  VideoPlayerWithControlsProps,
  VideoPlayerWithControlsRef,
} from '@/components/VideoPlayerWithControls/VideoPlayerWithControls'
import useBreakpoint from '@/hooks/use-breakpoint'
import { deviceInfo } from '@/utils'

export type ImagePropsWithoutSource = Omit<ImageProps, 'source'>

export type MediaRef = HTMLImageElement | VideoLoopV2ImperativeHandle | VideoPlayerWithControlsRef

type MediaProps = {
  source: SanityMedia
  className?: string
  cover?: boolean
  imageProps?: ImagePropsWithoutSource
  videoProps?: Omit<VideoLoopV2Props, 'src'>
  videoPlayerProps?: Omit<VideoPlayerWithControlsProps, 'src'>
}

const Media = forwardRef<MediaRef, MediaProps>(
  ({ className, cover, imageProps, videoProps, videoPlayerProps, source }, ref) => {
    const { isMobile, breakpoint } = useBreakpoint()
    const [isMp4, setIsMp4] = useState<boolean | null>(null)

    const calculatedSource = useMemo(() => {
      const sourceCopy = { ...source }
      const isMobileDevice = !deviceInfo?.device?.desktop

      /*
      Video Loop
      */
      if (sourceCopy._type === 'video' && sourceCopy?.vimeoData) {
        let url = null

        let keysAllowed: string[] = []
        if (breakpoint?.name === 'mobile') {
          keysAllowed = ['url360', 'url540', 'url240']
        } else if (breakpoint?.name === 'tablet') {
          keysAllowed = ['url720', 'url1080', 'url540']
        }

        if (keysAllowed.length && isMobileDevice) {
          setIsMp4(true)
          for (const key of keysAllowed) {
            if (sourceCopy.vimeoData?.[key] && !url) {
              url = sourceCopy.vimeoData[key]
            }
          }
        } else {
          if (sourceCopy.vimeoData.urlHls) {
            setIsMp4(false)
            url = sourceCopy.vimeoData.urlHls
          }
        }

        if (!url) {
          console.warn('No url exists for video. ', sourceCopy.vimeoData)
        }

        sourceCopy.url = url

        return sourceCopy
      }

      /*
      Video Player
      */
      if (sourceCopy._type === 'videoPlayer' && sourceCopy?.vimeoData) {
        let url = null

        if (isMobileDevice) {
          const keysAllowed = ['url1080', 'url720', 'url540', 'url360', 'url240']
          for (const key of keysAllowed) {
            if (sourceCopy.vimeoData?.[key] && !url) {
              url = sourceCopy.vimeoData[key]
              setIsMp4(true)
            }
          }
        } else {
          if (sourceCopy.vimeoData?.urlHls) {
            setIsMp4(false)
            url = sourceCopy.vimeoData.urlHls
          }
        }

        if (!url) {
          console.warn('No url exists for video. ', sourceCopy.vimeoData)
        }

        sourceCopy.url = url

        return sourceCopy
      }

      /*
      Otherwise return the original source
      */

      return sourceCopy
    }, [source, breakpoint])

    // Video
    if (
      (calculatedSource._type === 'video' || calculatedSource._type === 'videoPlayer') &&
      (isMp4 === null || isMobile === null)
    ) {
      return null
    }

    if (!source) return null

    return (
      <div className={classNames(styles.Media, { [styles.cover]: cover }, className)}>
        {calculatedSource._type === 'imageAsset' && (
          <SanityImage
            ref={ref as React.ForwardedRef<HTMLImageElement>}
            className={styles.image}
            source={calculatedSource}
            isCover={cover}
            {...imageProps}
          />
        )}
        {calculatedSource._type === 'video' && (
          <VideoLoopV2
            ref={ref as React.ForwardedRef<VideoLoopV2ImperativeHandle>}
            className={styles.video}
            src={calculatedSource?.url}
            forceMp4={isMp4 as boolean}
            {...videoProps}
          />
        )}
        {calculatedSource._type === 'videoPlayer' && (
          <VideoPlayerWithControls
            ref={ref as React.ForwardedRef<VideoPlayerWithControlsRef>}
            className={styles.video}
            previewImage={calculatedSource?.previewImage}
            previewOverlayOpacity={calculatedSource?.previewOverlayOpacity}
            src={calculatedSource?.url}
            forceMp4={isMp4 as boolean}
            {...videoPlayerProps}
          />
        )}
      </div>
    )
  },
)

Media.displayName = 'Media'

export default Media
