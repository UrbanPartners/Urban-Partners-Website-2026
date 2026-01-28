'use client'

import classnames from 'classnames'
import styles from './PeopleAccordion.module.scss'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import PlusMinusAnimation, { PlusMinusAnimationRef } from '@/components/PlusMinusAnimation/PlusMinusAnimation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useWindowResize from '@/hooks/use-window-resize'
import gsap from 'gsap'
import classNames from 'classnames'
import RichText from '@/components/RichText/RichText'
import PeopleAccordionPerson, { PeopleAccordionPersonRef } from './PeopleAccordionPerson'
import FadeIn, { FadeInRef } from '@/components/FadeIn/FadeIn'
import { buildIdFromText } from '@/utils'
import useBreakpoint from '@/hooks/use-breakpoint'
import TextSwapper, { TextSwapperRef } from '@/components/TextSwapper/TextSwapper'

export const ACCORDION_IN_DURATION = 1.2
export const ACCORDION_OUT_DURATION = 0.8
export const ACCORDION_EASE_IN = 'Power4.easeInOut'
export const ACCORDION_EASE_OUT = 'Power3.easeOut'

const PeopleAccordion = ({ className, items }: SanityPeopleAccordion) => {
  if (!items?.length) {
    return null
  }

  return (
    <div className={classnames(styles.PeopleAccordion, className)}>
      {items.map((item, index) => (
        <PeopleAccordionItemWrapper
          key={`${item._key}_${index}`}
          item={item}
          index={index}
        />
      ))}
      <LineAnimation
        position="bottom"
        animateFrom="left"
        startFull
      />
    </div>
  )
}

PeopleAccordion.displayName = 'PeopleAccordion'

// PeopleAccordionItemWrapper component
const PeopleAccordionItemWrapper = ({ item }: { item: SanityPeopleAccordionItem; index: number }) => {
  const titleContainerRef = useRef<HTMLDivElement>(null)
  const plusMinusAnimationRef = useRef<PlusMinusAnimationRef>(null)
  const rightContentRef = useRef<HTMLDivElement>(null)
  const leftSideRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const peopleItemRefs = useRef<(PeopleAccordionPersonRef | null)[]>([])
  const descriptionRef = useRef<FadeInRef>(null)
  const [calculations, setCalculations] = useState<{ minHeight: number; maxHeight: number }>({
    minHeight: 0,
    maxHeight: 0,
  })
  const resizeKey = useWindowResize()
  const isInitialSet = useRef(true)
  const [isHovering, setIsHovering] = useState(false)
  const id = useMemo(() => `peopleAccordion__${buildIdFromText(item.title)}`, [item.title])
  const triggerId = `${id}__trigger`
  const { isMobile } = useBreakpoint()
  const textSwapperRef = useRef<TextSwapperRef>(null)

  const getCalculations = useCallback(() => {
    if (!rightContentRef.current) {
      return { minHeight: 0, maxHeight: 0 }
    }

    let minHeight = 160

    if (isMobile) {
      minHeight = 120
    }

    let rightContentHeight = rightContentRef.current.offsetHeight

    if (isMobile) {
      if (leftSideRef.current) {
        rightContentHeight = rightContentHeight + leftSideRef.current.offsetHeight
      }
    }

    return {
      minHeight,
      maxHeight: rightContentHeight,
    }
  }, [isMobile])

  useEffect(() => {
    const calculations = getCalculations()
    setCalculations(calculations)
  }, [resizeKey, getCalculations])

  const animateIn = () => {
    if (!containerRef.current) return

    if (plusMinusAnimationRef.current) {
      plusMinusAnimationRef.current.setCurrentSign('minus')
    }

    if (descriptionRef.current) {
      descriptionRef.current.animateIn()
    }

    gsap.killTweensOf(containerRef.current)
    gsap[isInitialSet.current ? 'set' : 'to'](containerRef.current, {
      height: calculations.maxHeight,
      duration: ACCORDION_IN_DURATION,
      ease: ACCORDION_EASE_IN,
    })

    // Animate in all people items
    peopleItemRefs.current.forEach((ref, idx) => {
      if (ref) {
        setTimeout(() => {
          ref.animateIn()
        }, idx * 100)
      }
    })
  }

  const animateOut = () => {
    if (!containerRef.current) return

    if (plusMinusAnimationRef.current) {
      plusMinusAnimationRef.current.setCurrentSign('plus')
    }

    if (descriptionRef.current) {
      descriptionRef.current.animateOut()
    }

    gsap.killTweensOf(containerRef.current)
    gsap[isInitialSet.current ? 'set' : 'to'](containerRef.current, {
      height: calculations.minHeight,
      duration: ACCORDION_OUT_DURATION,
      ease: ACCORDION_EASE_OUT,
    })

    // Animate out all people items
    peopleItemRefs.current.forEach(ref => {
      if (ref) {
        ref.animateOut()
      }
    })
  }

  useEffect(() => {
    if (calculations.minHeight === calculations.maxHeight) {
      return
    }

    if (isOpen) {
      animateIn()
    } else {
      animateOut()
    }

    isInitialSet.current = false

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculations, isOpen])

  useEffect(() => {
    setIsOpen(false)
    animateOut()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizeKey])

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const ariaAttributes = {
    onClick: handleClick,
    onMouseEnter: () => {
      textSwapperRef.current?.swapText()
      setIsHovering(true)
    },
    onMouseLeave: () => setIsHovering(false),
    'aria-label': `${isOpen ? 'Close' : 'Open'} ${item.title} accordion`,
    'aria-expanded': isOpen,
    'aria-controls': id,
  }

  return (
    <div
      className={classNames(
        styles.item,
        {
          [styles.isHovering]: isHovering,
        },
        {
          [styles.isOpen]: isOpen,
        },
        {
          [styles.noDescription]: !item?.description?.length,
        },
      )}
      ref={containerRef}
      {...(!isOpen ? ariaAttributes : {})}
    >
      <div className={styles.inner}>
        <LineAnimation
          position="top"
          animateFrom="left"
          startFull
        />
        <div
          className={styles.leftSide}
          ref={leftSideRef}
        >
          <div
            className={styles.titleContainer}
            ref={titleContainerRef}
          >
            <button
              className={styles.titleButton}
              {...(isOpen ? ariaAttributes : {})}
              id={triggerId}
            >
              <h2 className={styles.title}>
                <TextSwapper
                  label={item.title}
                  animateInView
                  ref={textSwapperRef}
                />
              </h2>
            </button>
            {!!item?.description?.length && (
              <div className={styles.descriptionContainer}>
                <FadeIn
                  ref={descriptionRef}
                  className={styles.description}
                  inConfig={{
                    delay: 0.4,
                  }}
                >
                  <RichText content={item.description} />
                </FadeIn>
              </div>
            )}
            <PlusMinusAnimation
              className={styles.plusMinusAnimation}
              ref={plusMinusAnimationRef}
              element="span"
            />
          </div>
        </div>
        <div className={styles.rightSide}>
          <div
            ref={rightContentRef}
            className={styles.rightContent}
            role="region"
            id={id}
            aria-labelledby={triggerId}
          >
            <LineAnimation
              position="left"
              animateFrom="top"
              startFull
            />
            {item.people && (
              <div className={styles.peopleGrid}>
                {item.people.map((person, personIndex) => (
                  <PeopleAccordionPerson
                    key={`${personIndex}__${person.slug.current}`}
                    person={person}
                    ref={el => {
                      peopleItemRefs.current[personIndex] = el
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PeopleAccordion
