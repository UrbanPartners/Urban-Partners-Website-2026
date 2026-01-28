'use client'

import classnames from 'classnames'
import styles from './TextAccordion.module.scss'
import LineAnimation, { LineAnimationRef } from '@/components/LineAnimation/LineAnimation'
import ItemList, { ItemListRef } from '@/components/ItemList/ItemList'
import PlusMinusAnimation, { PlusMinusAnimationRef } from '@/components/PlusMinusAnimation/PlusMinusAnimation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useWindowResize from '@/hooks/use-window-resize'
import gsap from 'gsap'
import classNames from 'classnames'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import RichTextSplitText, { RichTextSplitTextRef } from '@/components/RichTextSplitText/RichTextSplitText'
import { buildIdFromText } from '@/utils'
import useBreakpoint from '@/hooks/use-breakpoint'
import TextSwapper, { TextSwapperRef } from '@/components/TextSwapper/TextSwapper'

const ACCORDION_IN_DURATION = 1.2
const ACCORDION_OUT_DURATION = 0.8
const ACCORDION_EASE_IN = 'Power4.easeInOut'
const ACCORDION_EASE_OUT = 'Power3.easeOut'

const TextAccordion = ({ className, items }: SanityTextAccordion) => {
  if (!items?.length) {
    return null
  }

  return (
    <div className={classnames(styles.TextAccordion, className)}>
      {items.map((item, index) => (
        <TextAccordionItem
          key={item._key || index}
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

TextAccordion.displayName = 'TextAccordion'

// TextAccordionItem component
const TextAccordionItem = ({ item, index }: { item: SanityTextAccordionItem; index: number }) => {
  const titleContainerRef = useRef<HTMLDivElement>(null)
  const plusMinusAnimationRef = useRef<PlusMinusAnimationRef>(null)
  const rightContentRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const descriptionSplitTextRef = useRef<RichTextSplitTextRef>(null)
  const itemListRef = useRef<ItemListRef>(null)
  const bigLineRef = useRef<LineAnimationRef>(null)
  const itemListTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const leftSideRef = useRef<HTMLButtonElement>(null)
  const [calculations, setCalculations] = useState<{ minHeight: number; maxHeight: number }>({
    minHeight: 0,
    maxHeight: 0,
  })
  const resizeKey = useWindowResize()
  const isInitialSet = useRef(true)
  const [isHovering, setIsHovering] = useState(false)
  const [allowToggle, setAllowToggle] = useState(false)
  const id = useMemo(() => `textAccordion__${buildIdFromText(item.title)}`, [item.title])
  const triggerId = `${id}__trigger`
  const { isMobile } = useBreakpoint()
  const textSwapperRef = useRef<TextSwapperRef>(null)

  // const isDebug = item.title === 'Mezzanine'

  const getCalculations = useCallback(() => {
    if (!titleContainerRef.current || !rightContentRef.current || !leftSideRef.current) {
      return { minHeight: 0, maxHeight: 0 }
    }

    // Get height of rightContent
    const rightContentHeight = rightContentRef.current.offsetHeight
    const minHeight = isMobile ? 120 : 225
    const leftSideHeight = leftSideRef.current.offsetHeight

    // Return object with minHeight and maxHeight
    return {
      minHeight: minHeight,
      maxHeight: isMobile ? leftSideHeight + rightContentHeight : rightContentHeight,
    }
  }, [isMobile])

  useEffect(() => {
    const calculations = getCalculations()
    setCalculations(calculations)
  }, [resizeKey, getCalculations])

  const animateIn = () => {
    if (itemListTimeoutRef.current) {
      clearTimeout(itemListTimeoutRef.current)
    }

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
    itemListTimeoutRef.current = setTimeout(
      () => {
        if (itemListRef.current) {
          itemListRef.current.animateIn()
        }
      },
      ACCORDION_IN_DURATION * 1000 * 0.5,
    )

    if (bigLineRef.current) {
      bigLineRef.current.animateIn()
    }
  }

  const animateOut = () => {
    if (itemListTimeoutRef.current) {
      clearTimeout(itemListTimeoutRef.current)
    }

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

    if (itemListRef.current) {
      itemListRef.current.animateOut()
    }

    if (bigLineRef.current) {
      bigLineRef.current.animateOut()
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
  }, [calculations, isOpen, allowToggle])

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const ariaProps = {
    onClick: handleClick,
    onMouseEnter: () => {
      if (!isMobile) {
        textSwapperRef.current?.swapText()
        setIsHovering(true)
      }
    },
    onMouseLeave: () => {
      if (!isMobile) {
        setIsHovering(false)
      }
    },
    'aria-label': `${isOpen ? 'Close' : 'Open'} ${item.title} accordion`,
    'aria-expanded': isOpen,
    'aria-controls': id,
  }

  return (
    <div
      className={classNames(
        styles.item,
        {
          [styles.hasItemListItems]: !!item?.itemList?.items?.length,
        },
        {
          [styles.isHovering]: isHovering,
        },
        {
          [styles.isOpen]: isOpen,
        },
      )}
      ref={containerRef}
      {...ariaProps}
      onClick={() => {
        if (!isOpen) {
          handleClick()
        }
      }}
      role="button"
    >
      <div className={styles.inner}>
        <LineAnimation
          position="top"
          animateFrom="left"
          startFull
        />
        <button
          className={styles.leftSide}
          ref={leftSideRef}
          {...ariaProps}
          id={triggerId}
        >
          <div className={styles.indexContainer}>
            <SplitTextComponent animateInView>
              <p className={styles.indexNumber}>{index + 1}</p>
            </SplitTextComponent>
          </div>
          <div
            className={styles.titleContainer}
            ref={titleContainerRef}
          >
            <LineAnimation
              position="left"
              animateFrom="top"
              size="full"
              animateInView
            />
            <h2 className={styles.title}>
              <TextSwapper
                label={item.title}
                animateInView
                ref={textSwapperRef}
              />
            </h2>
          </div>
        </button>
        <div className={styles.rightSide}>
          <div
            ref={rightContentRef}
            className={styles.rightContent}
            role="region"
            aria-labelledby={triggerId}
            id={id}
          >
            <PlusMinusAnimation
              className={styles.plusMinusAnimation}
              ref={plusMinusAnimationRef}
              htmlProps={ariaProps}
            />
            <LineAnimation
              position="left"
              animateFrom="top"
              ref={bigLineRef}
              longerDuration
            />
            {item.description && (
              <RichTextSplitText
                className={styles.description}
                splitTextProps={{
                  outConfig: config => ({
                    duration: config.duration * 0.6,
                  }),
                  revertOnAnimateIn: false,
                }}
                // debug={true}
                ref={descriptionSplitTextRef}
                content={item.description}
              />
            )}
            <div className={styles.bottomContent}>
              {item.itemList && (
                <ItemList
                  {...item.itemList}
                  className={styles.itemList}
                  firstColumnWidth="1/2"
                  ref={itemListRef}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextAccordion
