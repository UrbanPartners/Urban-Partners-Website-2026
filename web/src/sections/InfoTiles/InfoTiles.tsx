'use client'

import classnames from 'classnames'
import styles from './InfoTiles.module.scss'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import FadeIn, { FadeInRef } from '@/components/FadeIn/FadeIn'
import RichText from '@/components/RichText/RichText'
import Link from '@/components/Link/Link'
import PlusMinusAnimation, { PlusMinusAnimationRef } from '@/components/PlusMinusAnimation/PlusMinusAnimation'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import useBreakpoint from '@/hooks/use-breakpoint'
import classNames from 'classnames'
import { ACCORDION_OUT_DURATION, ACCORDION_EASE_OUT } from '../PeopleAccordion/PeopleAccordion'
import useWindowResize from '@/hooks/use-window-resize'
import TextSwapper, { TextSwapperRef } from '@/components/TextSwapper/TextSwapper'

const PER_ROW = 4

const InfoTiles = ({ className, items, tallerContent }: SanityInfoTiles) => {
  const { isMobile } = useBreakpoint()
  const hasMultipleRows = items?.length > PER_ROW

  if (!items?.length) {
    return null
  }

  return (
    <div
      className={classnames(styles.InfoTiles, className, {
        [styles.isMobile]: isMobile,
      })}
      data-info-tiles-taller-content={tallerContent}
    >
      <div className={styles.inner}>
        <div className={styles.items}>
          {items.map((item, index) => (
            <InfoTilesItem
              key={item._key || index}
              item={item}
              hasMultipleRows={hasMultipleRows}
              index={index}
              itemsLength={items.length}
              isLastItem={index === items.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

InfoTiles.displayName = 'InfoTiles'

// InfoTilesItem component
const InfoTilesItem = ({
  item,
  hasMultipleRows,
  index,
  itemsLength,
  isLastItem,
}: {
  item: SanityInfoTilesItem
  hasMultipleRows: boolean
  index: number
  itemsLength: number
  isLastItem: boolean
}) => {
  const plusMinusAnimationRef = useRef<PlusMinusAnimationRef>(null)
  const { isMobile } = useBreakpoint()
  const TitleContainer = isMobile ? 'div' : 'button'
  const [isOpen, setIsOpen] = useState(false)
  const innerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const titleContainerRef = useRef<any | null>(null)
  const bottomContentRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<FadeInRef>(null)
  const resizeKey = useWindowResize()
  const initialSet = useRef(false)

  const totalRows = Math.ceil(itemsLength / PER_ROW)
  const itemRow = Math.floor(index / PER_ROW) + 1
  const isInLastRow = itemRow === totalRows
  const textSwapperRef = useRef<TextSwapperRef>(null)

  const resetHtml = () => {
    if (containerRef.current) {
      gsap.set(containerRef.current, {
        clearProps: 'all',
      })
    }
  }

  const getCalculations = () => {
    const titleContainerHeight = titleContainerRef.current?.getBoundingClientRect().height
    const bottomContentHeight = bottomContentRef.current?.offsetHeight
    const maxHeight = titleContainerHeight + bottomContentHeight
    const minHeight = titleContainerHeight

    return { minHeight, maxHeight }
  }

  const animateIn = () => {
    if (plusMinusAnimationRef.current) {
      plusMinusAnimationRef.current.setCurrentSign('minus')
    }

    if (containerRef.current) {
      const { maxHeight } = getCalculations()
      gsap.killTweensOf(containerRef.current)
      gsap.to(containerRef.current, {
        height: maxHeight,
        duration: ACCORDION_OUT_DURATION,
        ease: ACCORDION_EASE_OUT,
      })
    }

    if (descriptionRef.current) {
      descriptionRef.current.animateIn()
    }
  }

  const animateOut = (immedate = false) => {
    if (plusMinusAnimationRef.current) {
      plusMinusAnimationRef.current.setCurrentSign('plus')
    }

    if (containerRef.current) {
      const { minHeight } = getCalculations()
      gsap.killTweensOf(containerRef.current)
      gsap[immedate ? 'set' : 'to'](containerRef.current, {
        height: minHeight,
        duration: ACCORDION_OUT_DURATION,
        ease: ACCORDION_EASE_OUT,
      })
    }

    if (descriptionRef.current) {
      descriptionRef.current.animateOut()
    }
  }

  useEffect(() => {
    if (!isMobile) {
      initialSet.current = false
      setIsOpen(false)
      resetHtml()
      return
    }
    if (isOpen) {
      animateIn()
    } else {
      animateOut(!initialSet.current)
      if (!initialSet.current) {
        initialSet.current = true
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, resizeKey, isMobile])

  const handleClick = () => {
    if (!isMobile) return
    setIsOpen(!isOpen)
  }

  return (
    <div
      className={classNames(
        styles.item,
        {
          [styles.isOpen]: isOpen,
        },
        {
          [styles.isMobile]: isMobile,
        },
        {
          [styles.hasMultipleRows]: hasMultipleRows,
        },
        {
          [styles.isNotInFirstRow]: index > PER_ROW - 1,
        },
        {
          [styles.isInLastRow]: isInLastRow,
        },
      )}
      ref={containerRef}
    >
      <div
        className={styles.itemInner}
        ref={innerRef}
      >
        {item.title && (
          <TitleContainer
            onClick={handleClick}
            className={styles.titleContainer}
            ref={titleContainerRef}
          >
            <SplitTextComponent
              animateInView
              element="h2"
              className={styles.title}
            >
              {item.title}
            </SplitTextComponent>
            {item.titleSubheader && (
              <FadeIn animateInView>
                <p className={styles.titleSubheader}>{item.titleSubheader}</p>
              </FadeIn>
            )}
            {isMobile && (
              <PlusMinusAnimation
                className={styles.plusMinusAnimation}
                ref={plusMinusAnimationRef}
              />
            )}
          </TitleContainer>
        )}
        <div
          className={styles.bottomContent}
          ref={bottomContentRef}
        >
          {item.description && (
            <FadeIn
              animateInView={!isMobile}
              className={styles.description}
              ref={descriptionRef}
              inConfig={{
                delay: isMobile ? 0.2 : 0,
              }}
            >
              <div className={styles.descriptionInner}>
                <RichText content={item.description} />
              </div>
            </FadeIn>
          )}
          {item.bottomLinks && item.bottomLinks.length > 0 && (
            <div className={styles.bottomLinks}>
              {item.bottomLinks.map((linkItem, linkIndex) => (
                <Link
                  key={linkIndex}
                  link={linkItem}
                  className={styles.bottomLink}
                  onMouseEnter={() => {
                    textSwapperRef.current?.swapText()
                  }}
                >
                  <span className={styles.bottomLink__inner}>
                    <TextSwapper
                      ref={textSwapperRef}
                      label={linkItem.label}
                    />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
        {!isMobile && (
          <LineAnimation
            position="right"
            animateFrom="top"
            size="tiny"
            animateInView
          />
        )}

        <LineAnimation
          position="top"
          animateFrom="left"
          startFull
        />

        {hasMultipleRows && !isInLastRow && (
          <LineAnimation
            position="bottom"
            animateFrom="left"
            startFull
          />
        )}

        {isLastItem && isMobile && (
          <LineAnimation
            position="bottom"
            animateFrom="left"
            startFull
          />
        )}
      </div>
    </div>
  )
}

InfoTilesItem.displayName = 'InfoTilesItem'

export default InfoTiles
