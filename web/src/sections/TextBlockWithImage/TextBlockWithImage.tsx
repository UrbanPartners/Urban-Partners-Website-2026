'use client'

import classnames from 'classnames'
import styles from './TextBlockWithImage.module.scss'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import RichTextSplitText from '@/components/RichTextSplitText/RichTextSplitText'
import FadeIn from '@/components/FadeIn/FadeIn'
import RichText from '@/components/RichText/RichText'
import SanityImage from '@/components/SanityImage/SanityImage'
import MaskReveal from '@/components/MaskReveal/MaskReveal'
import useBreakpoint from '@/hooks/use-breakpoint'

const TextBlockWithImage = ({ className, description, subheader, bottomText, image }: SanityTextBlockWithImage) => {
  const { isMobile } = useBreakpoint()
  return (
    <div className={classnames(styles.TextBlockWithImage, className)}>
      <LineAnimation
        position="top"
        animateFrom="left"
        animateInView
        longerDuration
      />
      <LineAnimation
        position="bottom"
        animateFrom="left"
        animateInView
        longerDuration
      />
      <div className={styles.inner}>
        <div className={styles.leftSide}>
          <div className={styles.topContent}>
            {description && (
              <RichTextSplitText
                content={description}
                splitTextProps={{
                  animateInView: true,
                }}
                className={styles.title}
              />
            )}
          </div>
          <FadeIn
            animateInView
            className={styles.bottomContent}
          >
            {subheader && <p className={styles.subheader}>{subheader}</p>}
            {bottomText && (
              <div className={styles.bottomText}>
                <RichText content={bottomText} />
              </div>
            )}
          </FadeIn>
        </div>
        <div className={styles.rightSide}>
          {isMobile && (
            <LineAnimation
              position="top"
              animateFrom="left"
              animateInView
              longerDuration
            />
          )}
          <div className={styles.rightSideInner}>
            <LineAnimation
              position="left"
              animateFrom="top"
              animateInView
              longerDuration
            />
            {image && (
              <MaskReveal
                direction="FROM_TOP"
                animateWhenInView
                className={styles.imageContainer}
              >
                <SanityImage
                  source={image}
                  className={styles.image}
                  aspectRatio={{
                    tablet: 512 / 287,
                    xs: 195 / 135,
                  }}
                  columns={{
                    tablet: 3,
                    xs: 6,
                  }}
                />
              </MaskReveal>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

TextBlockWithImage.displayName = 'TextBlockWithImage'

export default TextBlockWithImage
