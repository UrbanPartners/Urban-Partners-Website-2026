'use client'

import classnames from 'classnames'
import styles from './ImageBlocks.module.scss'
import SanityImage from '@/components/SanityImage/SanityImage'
import MaskReveal from '@/components/MaskReveal/MaskReveal'
import { SanityImage as SanityImageType } from '@/types/sanity/SanityImage'
import RichText from '@/components/RichText/RichText'
import { CSSProperties } from 'styled-components'
import { useMemo } from 'react'
import useBreakpoint from '@/hooks/use-breakpoint'
import FadeIn from '@/components/FadeIn/FadeIn'

const ASPECT_RATIO = {
  desktop: {
    left: {
      width: 736,
      height: 1056,
    },
    right: {
      width: 1088,
      height: 640,
    },
  },
  mobile: {
    left: {
      width: 180,
      height: 345,
    },
    right: {
      width: 165,
      height: 165,
    },
  },
}

const ImageBlocks = ({ className, image1, image2, title, description, flippedPosition }: SanityImageBlocks) => {
  const { isMobile } = useBreakpoint()

  const textContent = (
    <FadeIn
      animateInView
      className={styles.textContainer}
    >
      {title && <p className={styles.title}>{title}</p>}
      {description && (
        <div className={styles.description}>
          <RichText content={description} />
        </div>
      )}
    </FadeIn>
  )

  if (!image1?.asset || !image2?.asset) {
    return null
  }

  return (
    <div className={classnames(styles.ImageBlocks, className, { [styles.flippedPosition]: flippedPosition })}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <ImageContainer
            image={image1}
            position="left"
          />
        </div>
        <div className={styles.right}>
          <div className={styles.rightImageContainer}>
            <ImageContainer
              image={image2}
              position="right"
            />
          </div>
          {!isMobile && textContent}
        </div>
      </div>
      {isMobile && textContent}
    </div>
  )
}

const ImageContainer = ({ image, position }: { image: SanityImageType; position: 'left' | 'right' }) => {
  const { isMobile } = useBreakpoint()
  const imageProps = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: any = {
      left: {
        aspectRatio: {
          md: ASPECT_RATIO.desktop.left.width / ASPECT_RATIO.desktop.left.height,
          sm: ASPECT_RATIO.mobile.left.width / ASPECT_RATIO.mobile.left.height,
        },
        columns: {
          md: 4,
          sm: 6,
        },
      },
      right: {
        aspectRatio: {
          md: ASPECT_RATIO.desktop.right.width / ASPECT_RATIO.desktop.right.height,
          sm: ASPECT_RATIO.mobile.right.width / ASPECT_RATIO.mobile.right.height,
        },
        columns: {
          md: 8,
          sm: 6,
        },
      },
    }

    return props[position]
  }, [position])

  const aspect = isMobile ? imageProps.aspectRatio.sm : imageProps.aspectRatio.md

  if (!image?.asset || !aspect) {
    return null
  }

  return (
    <div
      className={styles.imageContainerWrapper}
      style={
        {
          '--aspect-ratio': aspect,
        } as CSSProperties
      }
    >
      <MaskReveal
        inConfig={{ duration: 1.4, ease: 'Power3.easeInOut' }}
        animateWhenInView={true}
        className={classnames(styles.imageContainer, { [styles[position]]: position })}
      >
        <SanityImage
          source={image}
          aspectRatio={imageProps.aspectRatio}
          columns={imageProps.columns}
          className={styles.image}
        />
      </MaskReveal>
    </div>
  )
}

ImageBlocks.displayName = 'ImageBlocks'

export default ImageBlocks
