'use client'

import classnames from 'classnames'
import styles from './LargeTitleHeroWithMedia.module.scss'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import FadeIn from '@/components/FadeIn/FadeIn'
import DownArrowAnimation from '@/components/DownArrowAnimation/DownArrowAnimation'
import Media from '@/components/Media/Media'
import MaskReveal from '@/components/MaskReveal/MaskReveal'
import RichTextSplitText from '@/components/RichTextSplitText/RichTextSplitText'
import useBreakpoint from '@/hooks/use-breakpoint'

const LargeTitleHeroWithMedia = ({
  className,
  title,
  subtitle,
  description,
  mediaAsset,
  mediaSize,
  mediaHeight,
  showArrow,
}: SanityLargeTitleHeroWithMedia) => {
  const { isMobile } = useBreakpoint()

  if (!title) {
    return null
  }

  return (
    <div
      className={classnames(styles.LargeTitleHeroWithMedia, className, { [styles.showArrow]: showArrow })}
      data-media-size={mediaSize}
      data-media-height={mediaHeight}
    >
      <div className={styles.inner}>
        {/* Title */}
        <div className={styles.titleContainer}>
          <SplitTextComponent
            animateInView
            type="words"
            inConfig={{
              delay: 0.075,
            }}
            // debug
            // revertOnAnimateIn={false}
          >
            <h1 className={styles.title}>{title}</h1>
          </SplitTextComponent>
        </div>

        {/* Middle Content (subtitle + description) */}
        {(subtitle || description) && (
          <div className={styles.middleContent}>
            {showArrow && isMobile && (
              <div className={styles.arrowContent}>
                <DownArrowAnimation
                  disableAnimation
                  animateInView
                />
              </div>
            )}
            <LineAnimation
              position="top"
              animateFrom="left"
              animateInView
              longerDuration
              inConfig={{
                delay: 0.4,
              }}
            />
            <div />
            <div className={styles.middleContentInner}>
              <LineAnimation
                position="left"
                animateFrom="top"
                animateInView
                inConfig={{
                  delay: 0.9,
                }}
                size="tiny"
              />
              {subtitle && (
                <FadeIn
                  animateInView
                  className={styles.subtitle}
                  inConfig={{
                    delay: 0.8,
                  }}
                >
                  <p>{subtitle}</p>
                </FadeIn>
              )}
              {description && (
                <RichTextSplitText
                  splitTextProps={{
                    animateInView: true,
                  }}
                  className={styles.description}
                  content={description}
                />
              )}
            </div>
          </div>
        )}

        {/* Arrow */}
        {showArrow && !isMobile && (
          <div className={styles.arrowContent}>
            <DownArrowAnimation
              disableAnimation
              animateInView
            />
          </div>
        )}

        {/* Media */}
        {mediaAsset && (
          <div className={styles.mediaContainer}>
            <MaskReveal
              direction="FROM_TOP"
              className={styles.mediaContainerInner}
              animateWhenInView
              hasSubtleBg
              inConfig={{
                duration: 1.2,
                ease: 'Power3.easeInOut',
              }}
            >
              <Media
                source={mediaAsset}
                className={styles.media}
                cover
              />
            </MaskReveal>
          </div>
        )}
      </div>
    </div>
  )
}

LargeTitleHeroWithMedia.displayName = 'LargeTitleHeroWithMedia'

export default LargeTitleHeroWithMedia
