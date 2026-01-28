'use client'

import classnames from 'classnames'
import styles from './RichTextSection.module.scss'
import RichText from '@/components/RichText/RichText'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import FadeIn from '@/components/FadeIn/FadeIn'
import AuthorThumbnail from '@/components/AuthorThumbnail/AuthorThumbnail'

const RichTextSection = ({ className, content, author }: SanityRichTextSection) => {
  return (
    <div className={classnames(styles.RichTextSection, className)}>
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
      <div className={styles.inner}>
        <div />
        <div className={styles.content}>
          <LineAnimation
            position="left"
            animateFrom="top"
            animateInView
            inConfig={defaultConfig => {
              return {
                duration: defaultConfig.duration * 1.5,
              }
            }}
            className={styles.verticalLine}
          />
          <FadeIn
            animateInView
            className={styles.richText}
          >
            <RichText content={content} />
          </FadeIn>
          {author && (
            <div className={styles.authorBlock}>
              <div className={styles.authorBlockInner}>
                <AuthorThumbnail
                  image={author.image}
                  name={author.fullName}
                  designation={author.designation}
                />
                <LineAnimation
                  position="bottom"
                  animateFrom="left"
                  animateInView
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <LineAnimation
        position="bottom"
        animateFrom="left"
        animateInView
        inConfig={defaultConfig => {
          return {
            duration: defaultConfig.duration * 1.5,
          }
        }}
      />
    </div>
  )
}

RichTextSection.displayName = 'RichTextSection'

export default RichTextSection
