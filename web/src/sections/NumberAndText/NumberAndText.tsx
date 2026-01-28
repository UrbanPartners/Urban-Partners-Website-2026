'use client'

import classnames from 'classnames'
import styles from './NumberAndText.module.scss'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import FadeIn from '@/components/FadeIn/FadeIn'
import RichText from '@/components/RichText/RichText'
import TextAndIconButton from '@/components/TextAndIconButton/TextAndIconButton'
import RichTextSplitText from '@/components/RichTextSplitText/RichTextSplitText'
import useBreakpoint from '@/hooks/use-breakpoint'

const NumberAndText = ({
  className,
  number,
  description,
  subheading,
  subheadingDescription,
  cta,
}: SanityNumberAndText) => {
  const hasSubheadingContent = subheading?.length || !!subheadingDescription?.length
  const hasCta = !!cta && cta?.link?.linkType !== 'disabled'
  const hasBottomContent = hasSubheadingContent || hasCta
  const { isMobile } = useBreakpoint()

  if (!number) {
    return null
  }

  return (
    <div
      className={classnames(styles.NumberAndText, className, {
        [styles.hasCTA]: hasCta,
      })}
    >
      <LineAnimation
        position="top"
        animateFrom="left"
        animateInView
        longerDuration
      />
      {hasCta && (
        <LineAnimation
          position="bottom"
          animateFrom="left"
          animateInView
          longerDuration
        />
      )}

      <div className={styles.inner}>
        <div className={styles.numberContainer}>
          <FadeIn
            animateInView
            className={styles.numberWrapper}
          >
            <div className={styles.number}>{number}</div>
          </FadeIn>
        </div>
        <div className={styles.descriptionContainer}>
          <div className={styles.descriptionContent}>
            {!!description?.length && (
              <RichTextSplitText
                className={styles.description}
                content={description}
                splitTextProps={{
                  animateInView: true,
                }}
              />
            )}
          </div>
          {hasBottomContent && (
            <div className={styles.bottomContent}>
              {hasSubheadingContent && (
                <div className={styles.subheadingContent}>
                  <FadeIn animateInView>
                    <p className={styles.subheading}>{subheading}</p>
                  </FadeIn>
                  {!!subheadingDescription?.length && (
                    <FadeIn
                      animateInView
                      className={styles.subheadingDescription}
                    >
                      <RichText content={subheadingDescription} />
                    </FadeIn>
                  )}
                </div>
              )}
              {hasCta && (
                <FadeIn
                  animateInView
                  className={styles.ctaContainer}
                >
                  <TextAndIconButton
                    link={cta.link}
                    icon={cta.icon}
                    className={styles.cta}
                    style={isMobile ? 'full' : 'full-line-left'}
                  />
                </FadeIn>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

NumberAndText.displayName = 'NumberAndText'

export default NumberAndText
