'use client'

import classnames from 'classnames'
import styles from './BasicAccordion.module.scss'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PlusMinusAnimation, { PlusMinusAnimationRef } from '@/components/PlusMinusAnimation/PlusMinusAnimation'
import gsap from 'gsap'
import RichTextSplitText, { RichTextSplitTextRef } from '@/components/RichTextSplitText/RichTextSplitText'
import { buildIdFromText } from '@/utils'
import useWindowResize from '@/hooks/use-window-resize'

const ACCORDION_IN_DURATION = 1.2
const ACCORDION_OUT_DURATION = 0.6
const ACCORDION_EASE_IN = 'Power4.easeInOut'
const ACCORDION_EASE_OUT = 'Power3.easeOut'

import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import FadeIn from '@/components/FadeIn/FadeIn'

const BasicAccordion = (props: SanityBasicAccordion) => {
  const { className, title, items } = props

  return (
    <div className={classnames(styles.BasicAccordion, className)}>
      <div className={styles.inner}>
        <div className={styles.leftSide}>{/* Left side content if any, or maybe this is empty for now */}</div>
        <div className={styles.rightSide}>
          {title && (
            <SplitTextComponent
              element="h1"
              className={styles.title}
              animateInView
            >
              {title}
            </SplitTextComponent>
          )}
          <div className={styles.items}>
            {items?.map((item, index) => (
              <AccordionItem
                key={item._key || index}
                item={item}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

BasicAccordion.displayName = 'BasicAccordion'

interface AccordionItemProps {
  item: SanityBasicAccordionItem
}

const AccordionItem = ({ item }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentInnerRef = useRef<HTMLDivElement>(null)
  const plusMinusAnimationRef = useRef<PlusMinusAnimationRef>(null)
  const descriptionSplitTextRef = useRef<RichTextSplitTextRef>(null)
  const resizeKey = useWindowResize()
  const isInitialSet = useRef(true)
  const [allowToggle, setAllowToggle] = useState(false)
  const id = useMemo(() => `basicAccordion__${buildIdFromText(item.title)}`, [item.title])
  const triggerId = `${id}__trigger`

  const getCalculations = useCallback(() => {
    if (!contentInnerRef.current) {
      return { minHeight: 0, maxHeight: 0 }
    }

    return {
      minHeight: 0,
      maxHeight: contentInnerRef.current.offsetHeight,
    }
  }, [])

  const [calculations, setCalculations] = useState<{
    minHeight: number
    maxHeight: number
  }>({
    minHeight: 0,
    maxHeight: 0,
  })

  useEffect(() => {
    const calcs = getCalculations()
    setCalculations(calcs)
  }, [resizeKey, getCalculations])

  const animateIn = () => {
    if (!containerRef.current) return

    if (plusMinusAnimationRef.current) {
      plusMinusAnimationRef.current.setCurrentSign('minus')
    }

    gsap.killTweensOf(containerRef.current)
    gsap[isInitialSet.current ? 'set' : 'to'](containerRef.current, {
      height: calculations.maxHeight,
      duration: ACCORDION_IN_DURATION,
      ease: ACCORDION_EASE_IN,
    })

    if (descriptionSplitTextRef.current) {
      descriptionSplitTextRef.current.animateIn()
    }
  }

  const animateOut = () => {
    if (!containerRef.current) return

    if (plusMinusAnimationRef.current) {
      plusMinusAnimationRef.current.setCurrentSign('plus')
    }

    gsap.killTweensOf(containerRef.current)
    gsap[isInitialSet.current ? 'set' : 'to'](containerRef.current, {
      height: calculations.minHeight,
      duration: ACCORDION_OUT_DURATION,
      ease: ACCORDION_EASE_OUT,
    })

    if (descriptionSplitTextRef.current) {
      descriptionSplitTextRef.current.animateOut()
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setAllowToggle(true)
    }, 75)
  }, [])

  useEffect(() => {
    if (!allowToggle) {
      return
    }

    // Force recalculation if we open and height is 0 (dynamic content loading usually)
    // but here we just rely on resizeKey and contentInnerRef
    // If dynamic height changes are expected, ResizeObserver on contentInnerRef is better.
    // For now, following TextAccordion pattern with getCalculations + resizeKey.

    if (isOpen) {
      animateIn()
    } else {
      animateOut()
    }

    isInitialSet.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculations, isOpen, allowToggle])

  const handleClick = () => {
    // Recalculate height before opening to ensure accuracy
    const calcs = getCalculations()
    setCalculations(calcs)
    setIsOpen(!isOpen)
  }

  return (
    <div className={styles.AccordionItem}>
      <LineAnimation
        position="top"
        animateFrom="left"
        animateInView
      />
      <button
        className={styles.trigger}
        onClick={handleClick}
        aria-expanded={isOpen}
        aria-controls={id}
        id={triggerId}
      >
        <SplitTextComponent
          element="span"
          className={styles.itemTitle}
          animateInView
        >
          {item.title}
        </SplitTextComponent>
        <FadeIn animateInView>
          <PlusMinusAnimation
            element="span"
            ref={plusMinusAnimationRef}
            className={styles.plusMinusAnimation}
          />
        </FadeIn>
      </button>
      <div
        className={styles.contentContainer}
        ref={containerRef}
        id={id}
        role="region"
        aria-labelledby={triggerId}
      >
        <div
          className={styles.contentInner}
          ref={contentInnerRef}
        >
          {item.description && (
            <RichTextSplitText
              className={styles.description}
              content={item.description}
              ref={descriptionSplitTextRef}
              splitTextProps={{
                inConfig: {
                  delay: 0.4,
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BasicAccordion
