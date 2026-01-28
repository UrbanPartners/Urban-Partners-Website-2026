'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import classnames from 'classnames'
import styles from './TextBlocksWithImageSwapper.module.scss'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import FadeIn from '@/components/FadeIn/FadeIn'
import RichText from '@/components/RichText/RichText'
import SanityImage from '@/components/SanityImage/SanityImage'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import useWindowResize from '@/hooks/use-window-resize'
import useInView from '@/hooks/use-in-view'
import useStickyTop from '@/hooks/use-sticky-top'
import useBreakpoint from '@/hooks/use-breakpoint'

gsap.registerPlugin(ScrollTrigger)

const TextBlocksWithImageSwapper = ({ className, items }: SanityTextBlocksWithImageSwapper) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(0)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollTriggersRef = useRef<ScrollTrigger[]>([])
  const resizeKey = useWindowResize()
  const { setStickyElement, setStickyElementParent } = useStickyTop()
  const { isMobile } = useBreakpoint()
  const { isInView, setElementToObserve } = useInView({
    scrolltriggerStart: 'top-=1000px bottom',
  })
  const imageIndexByItems = useMemo(() => {
    let previousValidIndex = 0
    const indexes: number[] = []
    items.forEach((item, index) => {
      if (item?.image) {
        previousValidIndex = index
      }
      indexes.push(previousValidIndex)
    })
    return indexes
  }, [items])

  useEffect(() => {
    if (!items?.length) return

    // Kill existing triggers
    scrollTriggersRef.current.forEach(trigger => trigger?.kill())
    scrollTriggersRef.current = []

    if (isMobile) {
      return
    }

    items.forEach((_, index) => {
      const itemElement = itemRefs.current[index]
      if (!itemElement) return

      const indexToActivate = imageIndexByItems[index]

      const trigger = ScrollTrigger.create({
        trigger: itemElement,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => {
          setActiveImageIndex(indexToActivate)
        },
        onEnterBack: () => {
          setActiveImageIndex(indexToActivate)
        },
      })

      scrollTriggersRef.current.push(trigger)
    })

    return () => {
      scrollTriggersRef.current.forEach(trigger => trigger?.kill())
      scrollTriggersRef.current = []
    }
  }, [items, resizeKey, imageIndexByItems, isMobile])

  if (!items?.length) {
    return null
  }

  return (
    <div
      className={classnames(styles.TextBlocksWithImageSwapper, className)}
      ref={setElementToObserve}
    >
      <LineAnimation
        position="top"
        animateFrom="left"
        animateInView
        longerDuration
      />
      <div
        className={styles.inner}
        ref={setStickyElementParent}
      >
        <div className={styles.leftSide}>
          <div
            className={styles.imageContainerOuter}
            ref={setStickyElement}
          >
            <div className={styles.imageContainer}>
              {items.map((item, index) => {
                if (!item.image) return null
                return (
                  <SanityImage
                    key={item._key || index}
                    source={item.image}
                    aspectRatio={1}
                    className={classnames(styles.image, {
                      [styles.active]: activeImageIndex === index,
                    })}
                    columns={{
                      xs: 4,
                      laptop: 12,
                    }}
                    preload={isInView}
                  />
                )
              })}
            </div>
          </div>
        </div>
        <div className={styles.rightSide}>
          {items.map((item, index) => (
            <div
              key={item._key || index}
              ref={el => {
                itemRefs.current[index] = el
              }}
              className={styles.item}
            >
              <SplitTextComponent
                animateInView
                element="h2"
                className={styles.title}
              >
                {item.title}
              </SplitTextComponent>
              <FadeIn
                animateInView
                className={styles.description}
              >
                <RichText content={item.description} />
              </FadeIn>
              {index !== 0 && (
                <LineAnimation
                  position="top"
                  animateFrom="left"
                  animateInView
                  className={styles.lineAnimationTop}
                />
              )}

              <LineAnimation
                position="left"
                animateFrom="top"
                className={styles.lineAnimationSide}
                animateInView
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

TextBlocksWithImageSwapper.displayName = 'TextBlocksWithImageSwapper'

export default TextBlocksWithImageSwapper
