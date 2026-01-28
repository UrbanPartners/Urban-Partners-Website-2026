'use client'

import classnames from 'classnames'
import styles from './FactList.module.scss'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import FadeIn from '@/components/FadeIn/FadeIn'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import RichText from '@/components/RichText/RichText'

const FactList = ({ className, title, description, items }: SanityFactList) => {
  if (!items?.length) {
    return null
  }

  return (
    <div className={classnames(styles.FactList, className)}>
      <LineAnimation
        position="top"
        animateFrom="left"
        animateInView
        longerDuration
      />
      <div className={styles.inner}>
        <div className={styles.leftColumn}>
          {!!description?.length && (
            <FadeIn
              animateInView
              className={styles.description}
            >
              <RichText content={description} />
            </FadeIn>
          )}
        </div>
        <div className={styles.rightColumn}>
          {title && (
            <SplitTextComponent
              animateInView
              className={styles.titleContainer}
              revertOnAnimateIn={false}
            >
              <h2 className={styles.title}>{title}</h2>
            </SplitTextComponent>
          )}
          <ul className={styles.items}>
            {items.map((item, index) => (
              <li
                key={index}
                className={styles.item}
              >
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>
                    <SplitTextComponent animateInView>{item.title}</SplitTextComponent>
                    <LineAnimation
                      position="right"
                      animateFrom="bottom"
                      animateInView
                    />
                  </div>
                  <div className={styles.itemDescription}>
                    <SplitTextComponent animateInView>{item.description}</SplitTextComponent>
                  </div>
                  <LineAnimation
                    position="bottom"
                    animateFrom="left"
                    longerDuration
                    animateInView
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <LineAnimation
        position="bottom"
        animateFrom="left"
        animateInView
        longerDuration
      />
    </div>
  )
}

FactList.displayName = 'FactList'

export default FactList
