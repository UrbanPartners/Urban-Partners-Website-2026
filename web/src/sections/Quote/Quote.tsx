'use client'

import classnames from 'classnames'
import styles from './Quote.module.scss'
import Icon from '@/components/Icon/Icon'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import FadeIn from '@/components/FadeIn/FadeIn'
import AuthorThumbnail from '@/components/AuthorThumbnail/AuthorThumbnail'
import RichTextSplitText from '@/components/RichTextSplitText/RichTextSplitText'

const Quote = ({
  className,
  content,
  authorImage,
  authorName,
  authorDesignation,
}: SanityQuote & { className?: string }) => {
  return (
    <div className={classnames(styles.Quote, className)}>
      <div className={styles.inner}>
        <LineAnimation
          position="top"
          animateFrom="left"
          animateInView
          inConfig={defaultConfig => {
            return {
              duration: defaultConfig.duration * 1.5,
            }
          }}
        />
        <div className={styles.left}>
          <LineAnimation
            position="top"
            animateFrom="left"
            animateInView
            className={styles.lineAnimationMobile}
          />
          <FadeIn
            animateInView
            className={styles.authorThumbnailContainer}
          >
            <AuthorThumbnail
              image={authorImage}
              name={authorName}
              designation={authorDesignation}
              className={styles.authorThumbnail}
            />
          </FadeIn>
          <div className={styles.quoteBox}>
            <LineAnimation
              position="left"
              animateFrom="top"
              animateInView
              size="tiny"
            />
            <FadeIn animateInView>
              <Icon
                name="quoteOpening"
                className={styles.quoteOpening}
              />
            </FadeIn>
          </div>
        </div>
        <div className={styles.right}>
          {!!content?.length && (
            <RichTextSplitText
              splitTextProps={{
                animateInView: true,
              }}
              className={styles.quoteText}
              // revertOnAnimateIn={false}
              content={content}
            />
          )}
        </div>
      </div>
    </div>
  )
}

Quote.displayName = 'Quote'

export default Quote
