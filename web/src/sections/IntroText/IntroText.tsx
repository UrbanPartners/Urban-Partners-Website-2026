'use client'

import classnames from 'classnames'
import styles from './IntroText.module.scss'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import FadeIn from '@/components/FadeIn/FadeIn'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import RichText from '@/components/RichText/RichText'

const IntroText = ({ className, title, description }: SanityIntroText) => {
  if (!title || !description?.length) {
    return null
  }

  return (
    <div className={classnames(styles.IntroText, className)}>
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
        <div className={styles.titleContainer}>
          {title && (
            <FadeIn
              animateInView
              className={styles.titleContainer}
            >
              <h2 className={styles.title}>{title}</h2>
            </FadeIn>
          )}
        </div>
        <div className={styles.descriptionContainer}>
          {!!description?.length && (
            <SplitTextComponent
              animateInView
              className={styles.description}
            >
              <RichText content={description} />
            </SplitTextComponent>
          )}
        </div>
      </div>
    </div>
  )
}

IntroText.displayName = 'IntroText'

export default IntroText
