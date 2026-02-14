'use client'

import classnames from 'classnames'
import styles from './ImageAndTextAccordion.module.scss'
import LineAnimation, { LineAnimationRef } from '@/components/LineAnimation/LineAnimation'
import SanityImage from '@/components/SanityImage/SanityImage'
import ItemList, { ItemListRef } from '@/components/ItemList/ItemList'
import PlusMinusAnimation, { PlusMinusAnimationRef } from '@/components/PlusMinusAnimation/PlusMinusAnimation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useWindowResize from '@/hooks/use-window-resize'
import gsap from 'gsap'
import classNames from 'classnames'
import SplitTextComponent, { SplitTextRef } from '@/components/SplitTextComponent/SplitTextComponent'
import RichTextSplitText, { RichTextSplitTextRef } from '@/components/RichTextSplitText/RichTextSplitText'
import useBreakpoint from '@/hooks/use-breakpoint'
import { buildIdFromText } from '@/utils'
import TextSwapper, { TextSwapperRef } from '@/components/TextSwapper/TextSwapper'

const ACCORDION_IN_DURATION = 1.2
const ACCORDION_OUT_DURATION = 0.8
const ACCORDION_EASE_IN = 'Power4.easeInOut'
const ACCORDION_EASE_OUT = 'Power3.easeOut'

const ImageAndTextAccordion = ({ className, items }: SanityImageAndTextAccordion) => {
  if (!items?.length) {
    return null
  }

  return (
    <div className={classnames(styles.ImageAndTextAccordion, className)}>
      {items.map((item, index) => (
        <ImageAndTextAccordionItem
          key={item._key || index}
          item={item}
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

ImageAndTextAccordion.displayName = 'ImageAndTextAccordion'

// ImageAndTextAccordionItem component
const ImageAndTextAccordionItem = ({ item }: { item: SanityImageAndTextAccordionItem }) => {
  const titleContainerRef = useRef<HTMLButtonElement>(null)
  const plusMinusAnimationRef = useRef<PlusMinusAnimationRef>(null)
  const smallImagePositionRef = useRef<HTMLDivElement>(null)
  const leftSideRef = useRef<HTMLDivElement>(null)
  const rightContentRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const descriptionSplitTextRef = useRef<RichTextSplitTextRef>(null)
  const bigNumberSplitTextRef = useRef<SplitTextRef>(null)
  const bigNumberSubtitleSplitTextRef = useRef<SplitTextRef>(null)
  const bigNumberLineRef = useRef<LineAnimationRef>(null)
  const itemListRef = useRef<ItemListRef>(null)
  const imageAnimateContainerRef = useRef<HTMLDivElement>(null)
  const tinyLineRef = useRef<LineAnimationRef>(null)
  const itemListTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { isMobile } = useBreakpoint()
  const id = useMemo(() => `imageAndTextAccordion__${buildIdFromText(item.title)}`, [item.title])
  const triggerId = `${id}__trigger`
  const [calculations, setCalculations] = useState<{ minHeight: number; maxHeight: number }>({
    minHeight: 0,
    maxHeight: 0,
  })
  const resizeKey = useWindowResize({
    debounce: 300,
  })
  const { breakpoint } = useBreakpoint()
  const isInitialSet = useRef(true)
  const [isHovering, setIsHovering] = useState(false)
  const [allowToggle, setAllowToggle] = useState(false)
  const textSwapperRef = useRef<TextSwapperRef>(null)
  const isLongBigNumber = useMemo(() => {
    if (!item?.bigNumber) return false
    return item?.bigNumber?.length > 6
  }, [item.bigNumber])

  useEffect(() => {
    setTimeout(() => {
      setAllowToggle(true)
    }, 75)
  }, [])

  const animateImage = (isAnimatingLarge: boolean, immediate = false) => {
    if (!imageContainerRef.current || !smallImagePositionRef.current) return

    // Get the image element
    const imageElement = imageContainerRef.current.querySelector('img') as HTMLImageElement | null
    if (!imageElement || !imageAnimateContainerRef.current) return

    // Get dimensions
    const imageContainerWidth = imageContainerRef.current.offsetWidth
    const imageContainerHeight = imageContainerRef.current.offsetHeight
    const smallImagePositionWidth = smallImagePositionRef.current.offsetWidth
    const smallImagePositionHeight = smallImagePositionRef.current.offsetHeight

    // Calculate scale difference
    const scaleX = smallImagePositionWidth / imageContainerWidth
    const scaleY = smallImagePositionHeight / imageContainerHeight

    // Kill existing tweens
    gsap.killTweensOf([imageElement, imageAnimateContainerRef.current])

    // Animate to appropriate scale
    if (isAnimatingLarge) {
      gsap[immediate ? 'set' : 'to'](imageAnimateContainerRef.current, {
        scaleX: 1,
        scaleY: 1,
        duration: ACCORDION_IN_DURATION,
        ease: ACCORDION_EASE_IN,
      })
      gsap[immediate ? 'set' : 'to'](imageElement, {
        scale: 1,
        duration: ACCORDION_IN_DURATION,
        ease: ACCORDION_EASE_IN,
      })
    } else {
      gsap[immediate ? 'set' : 'to'](imageAnimateContainerRef.current, {
        scaleX,
        scaleY,
        duration: ACCORDION_OUT_DURATION,
        ease: ACCORDION_EASE_OUT,
      })
      gsap[immediate ? 'set' : 'to'](imageElement, {
        scale: 1.4,
        duration: ACCORDION_OUT_DURATION,
        ease: ACCORDION_EASE_OUT,
      })
    }
  }

  const getCalculations = useCallback(() => {
    if (
      !smallImagePositionRef.current ||
      !leftSideRef.current ||
      !rightContentRef.current ||
      !titleContainerRef.current
    ) {
      return { minHeight: 0, maxHeight: 0 }
    }

    // Get height of smallImagePosition
    const smallImageHeight = smallImagePositionRef.current.offsetHeight

    // Get top and bottom padding from leftSide
    const leftSideStyles = getComputedStyle(leftSideRef.current)
    const topPadding = parseFloat(leftSideStyles.paddingTop) || 0
    const bottomPadding = parseFloat(leftSideStyles.paddingBottom) || 0
    const titleHeight = titleContainerRef.current.offsetHeight

    // Calculate minHeight
    let minHeight = smallImageHeight + topPadding + bottomPadding

    if (isMobile) {
      if (smallImagePositionRef.current) {
        const titleComputed = getComputedStyle(titleContainerRef.current)
        const titlePaddingTop = parseFloat(titleComputed.paddingTop) || 0
        minHeight = titleHeight + smallImagePositionRef.current.offsetHeight + titlePaddingTop
      }
    }

    // Get height of rightContent
    let rightContentHeight = rightContentRef.current.offsetHeight

    if (breakpoint?.name === 'laptop' || breakpoint?.name === 'desktop') {
      rightContentHeight = rightContentHeight + titleHeight
    }

    if (isMobile) {
      if (imageAnimateContainerRef.current) {
        rightContentHeight = titleHeight + imageAnimateContainerRef.current.offsetHeight + rightContentHeight
      }
    }

    // Return object with minHeight and maxHeight
    return {
      minHeight,
      maxHeight: rightContentHeight,
    }
  }, [breakpoint?.name, isMobile])

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

    animateImage(true)

    gsap.killTweensOf(containerRef.current)
    gsap[isInitialSet.current ? 'set' : 'to'](containerRef.current, {
      height: calculations.maxHeight,
      duration: ACCORDION_IN_DURATION,
      ease: ACCORDION_EASE_IN,
    })

    if (descriptionSplitTextRef.current) {
      descriptionSplitTextRef.current.animateIn()
    }
    if (bigNumberSplitTextRef.current) {
      bigNumberSplitTextRef.current.animateIn()
    }
    if (bigNumberSubtitleSplitTextRef.current) {
      bigNumberSubtitleSplitTextRef.current.animateIn()
    }
    if (bigNumberLineRef.current) {
      bigNumberLineRef.current.animateIn()
    }
    itemListTimeoutRef.current = setTimeout(
      () => {
        if (itemListRef.current) {
          itemListRef.current.animateIn()
        }
      },
      ACCORDION_IN_DURATION * 1000 * 0.5,
    )

    if (tinyLineRef.current) {
      tinyLineRef.current.animateIn()
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

    animateImage(false)

    gsap.killTweensOf(containerRef.current)
    gsap[isInitialSet.current ? 'set' : 'to'](containerRef.current, {
      height: calculations.minHeight,
      duration: ACCORDION_OUT_DURATION,
      ease: ACCORDION_EASE_OUT,
    })

    if (descriptionSplitTextRef.current) {
      descriptionSplitTextRef.current.animateOut()
    }
    if (bigNumberSplitTextRef.current) {
      bigNumberSplitTextRef.current.animateOut()
    }
    if (bigNumberSubtitleSplitTextRef.current) {
      bigNumberSubtitleSplitTextRef.current.animateOut()
    }
    if (bigNumberLineRef.current) {
      bigNumberLineRef.current.animateOut()
    }
    if (itemListRef.current) {
      itemListRef.current.animateOut()
    }
    if (tinyLineRef.current) {
      tinyLineRef.current.animateOut()
    }
  }

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

    if (isInitialSet.current) {
      animateImage(false, true)
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

  const imageContent = (
    <div
      className={styles.imageContainerOuter}
      onClick={() => {
        if (isMobile && !isOpen) {
          handleClick()
        }
      }}
    >
      <div
        ref={smallImagePositionRef}
        className={styles.imageContainer__smallImagePosition}
      />
      <div
        ref={imageContainerRef}
        className={styles.imageContainer}
      >
        <div
          ref={imageAnimateContainerRef}
          className={styles.imageAnimateContainer}
        >
          <SanityImage
            source={item.image}
            className={styles.image}
            aspectRatio={1}
            columns={{
              tablet: 4,
              xs: 12,
            }}
          />
        </div>
      </div>
    </div>
  )

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
        {
          [styles.isLongBigNumber]: isLongBigNumber,
        },
      )}
      ref={containerRef}
      {...(!isMobile && !isOpen && ariaProps)}
    >
      <div className={styles.inner}>
        <LineAnimation
          position="top"
          animateFrom="left"
          startFull
        />
        <div
          ref={leftSideRef}
          className={styles.leftSide}
          role="button"
        >
          <LineAnimation
            position="right"
            animateFrom="top"
            longerDuration
            startFull
          />
          {!isMobile && imageContent}
        </div>
        <div
          className={styles.rightSide}
          {...(isMobile && !isOpen && ariaProps)}
        >
          <button
            className={styles.titleContainer}
            ref={titleContainerRef}
            id={triggerId}
            {...(isOpen && ariaProps)}
          >
            <h2 className={styles.title}>
              <TextSwapper
                label={item.title}
                ref={textSwapperRef}
                animateInView
              />
            </h2>
          </button>
          <button
            className={styles.plusMinusButton}
            {...(isOpen && { ...ariaProps, onMouseEnter: () => {} })}
          >
            <PlusMinusAnimation
              className={styles.plusMinusAnimation}
              ref={plusMinusAnimationRef}
              element="span"
            />
          </button>
          {isMobile && imageContent}
          <div
            ref={rightContentRef}
            className={styles.rightContent}
            role="region"
            aria-labelledby={triggerId}
            id={id}
          >
            <LineAnimation
              position="left"
              animateFrom="top"
              size="tiny"
              ref={tinyLineRef}
              className={styles.tinyLine}
            />
            {item.description && (
              <div className={styles.description}>
                <RichTextSplitText
                  ref={descriptionSplitTextRef}
                  // debug
                  splitTextProps={{
                    revertOnAnimateIn: false,
                    outConfig: config => ({
                      duration: config.duration * 0.6,
                    }),
                  }}
                  content={item.description}
                />
              </div>
            )}
            <div className={styles.bottomContent}>
              {item.bigNumber && (
                <div className={styles.bigNumberContainer}>
                  <div className={styles.bigNumber}>
                    <SplitTextComponent
                      revertOnAnimateIn={false}
                      ref={bigNumberSplitTextRef}
                      type="chars"
                      inConfig={{
                        delay: 0.03,
                      }}
                    >
                      <span>{item.bigNumber}</span>
                    </SplitTextComponent>
                  </div>
                  {item.bigNumberSubtitle && (
                    <SplitTextComponent
                      revertOnAnimateIn={false}
                      ref={bigNumberSubtitleSplitTextRef}
                    >
                      <p className={styles.bigNumberSubtitle}>{item.bigNumberSubtitle}</p>
                    </SplitTextComponent>
                  )}

                  {item?.itemList?.title && (
                    <LineAnimation
                      ref={bigNumberLineRef}
                      position="bottom"
                      animateFrom="left"
                      longerDuration
                    />
                  )}
                </div>
              )}
              {item.itemList && (
                <ItemList
                  {...item.itemList}
                  className={styles.itemList}
                  firstColumnWidth={item.bigNumber ? '1/2' : '1/4'}
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

export default ImageAndTextAccordion
