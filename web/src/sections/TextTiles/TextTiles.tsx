'use client'

import classnames from 'classnames'
import styles from './TextTiles.module.scss'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import FadeIn from '@/components/FadeIn/FadeIn'
import RichText from '@/components/RichText/RichText'

const TextTiles = ({ className, itemsPerRow, items }: SanityTextTiles) => {
  if (!items?.length) {
    return null
  }

  return (
    <div
      className={classnames(styles.TextTiles, className)}
      data-items-per-row={itemsPerRow}
    >
      <div className={styles.inner}>
        <LineAnimation
          position="top"
          animateFrom="left"
          animateInView
          longerDuration
        />
        <div className={styles.items}>
          {items.map((item, index) => {
            const itemsPerRowNum = Number(itemsPerRow)
            const isNotFirstRow = index >= itemsPerRowNum

            return (
              <div
                key={item._key || index}
                className={classnames(styles.item, {
                  [styles.notFirstRow]: isNotFirstRow,
                })}
              >
                {item.title && (
                  <SplitTextComponent
                    animateInView
                    element="h2"
                    className={styles.title}
                  >
                    {item.title}
                  </SplitTextComponent>
                )}
                {item.description && (
                  <FadeIn
                    animateInView
                    className={styles.description}
                  >
                    <div className={styles.descriptionInner}>
                      <RichText content={item.description} />
                    </div>
                  </FadeIn>
                )}
                <LineAnimation
                  position="right"
                  animateFrom="top"
                  animateInView
                  className={styles.lineAnimationRight}
                />
                <LineAnimation
                  position="bottom"
                  animateFrom="left"
                  animateInView
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

TextTiles.displayName = 'TextTiles'

export default TextTiles
