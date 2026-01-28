'use client'

import classnames from 'classnames'
import styles from './BigMedia.module.scss'
import Media, { ImagePropsWithoutSource } from '@/components/Media/Media'
import { useMemo } from 'react'
import MaskReveal from '@/components/MaskReveal/MaskReveal'

const BigMedia = ({ className, size, height, position, mediaAsset, customAspectRatio }: SanityBigMedia) => {
  const aspectRatio = useMemo(() => {
    if (height === 'customAspectRatio') {
      const split = customAspectRatio?.split(':')
      if (!split) return null
      const width = parseInt(split[0])
      const height = parseInt(split[1])
      if (isNaN(width) || isNaN(height)) {
        console.warn('Invalid custom aspect ratio', customAspectRatio)
        return null
      }
      return width / height
    }

    return null
  }, [height, customAspectRatio])

  const imageProps = useMemo(() => {
    const fullAspect = {
      aspectRatio: 1856 / 832,
      columns: 12,
    }

    const _3_4_aspect = {
      aspectRatio: 1408 / 832,
      columns: {
        tablet: 9,
        xs: 12,
      },
    }

    if (size === '3/4') {
      return _3_4_aspect
    }

    return fullAspect
  }, [size])

  return (
    <div
      className={classnames(styles.BigMedia, className)}
      data-big-media-size={size}
      data-big-media-position={position}
      data-big-media-height={height}
      style={
        {
          '--big-media-aspect-ratio': aspectRatio,
        } as React.CSSProperties
      }
    >
      <div className={styles.innerContainer}>
        <MaskReveal
          direction="FROM_TOP"
          className={styles.inner}
          animateWhenInView
          inConfig={{
            duration: 1.2,
            ease: 'Power3.easeInOut',
          }}
        >
          <Media
            source={mediaAsset}
            className={styles.media}
            cover
            imageProps={imageProps as ImagePropsWithoutSource}
          />
        </MaskReveal>
      </div>
    </div>
  )
}

BigMedia.displayName = 'BigMedia'

export default BigMedia
