'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import classnames from 'classnames'
import styles from './ItemList.module.scss'
import RichText from '@/components/RichText/RichText'
import SplitTextComponent, { SplitTextRef } from '@/components/SplitTextComponent/SplitTextComponent'
import FadeIn, { FadeInRef } from '@/components/FadeIn/FadeIn'
import LineAnimation, { LineAnimationRef } from '@/components/LineAnimation/LineAnimation'
import useInView from '@/hooks/use-in-view'

export interface ItemListRef {
  animateIn: () => void
  animateOut: () => void
}

interface ItemListProps extends SanityItemList {
  className?: string
  theme?: 'light' | 'faded'
  firstColumnWidth?: '1/4' | '1/2'
  animateInView?: boolean
}

const ItemList = forwardRef<ItemListRef, ItemListProps>(
  ({ className, title, items, theme = 'light', firstColumnWidth = '1/4', animateInView = false }, ref) => {
    const { isInView, setElementToObserve } = useInView({
      scrolltriggerStart: 'top+=60px bottom',
    })
    const itemListRefs = useRef<(ItemListItemRef | null)[]>([])
    const titleSplitTextRef = useRef<SplitTextRef>(null)

    const animateIn = () => {
      itemListRefs.current.forEach(itemRef => {
        if (itemRef) {
          itemRef.animateIn()
        }
      })

      if (titleSplitTextRef.current) {
        titleSplitTextRef.current.animateIn()
      }
    }

    const animateOut = () => {
      itemListRefs.current.forEach(itemRef => {
        if (itemRef) {
          itemRef.animateOut()
        }
      })

      if (titleSplitTextRef.current) {
        titleSplitTextRef.current.animateOut()
      }
    }

    useImperativeHandle(ref, () => ({
      animateIn,
      animateOut,
    }))

    useEffect(() => {
      if (!isInView || !animateInView) return
      animateIn()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInView, animateInView])

    if (!items?.length) {
      return null
    }

    return (
      <div
        ref={ref => {
          setElementToObserve(ref)
        }}
        className={classnames(styles.ItemList, className)}
        data-item-list-theme={theme}
        data-first-column-width={firstColumnWidth}
      >
        {title && (
          <SplitTextComponent
            className={styles.title}
            ref={titleSplitTextRef}
          >
            <p>{title}</p>
          </SplitTextComponent>
        )}
        <ul className={styles.items}>
          {items.map((item, index) => (
            <ItemListItem
              key={item._key}
              ref={el => {
                itemListRefs.current[index] = el
              }}
              item={item}
              index={index}
            />
          ))}
        </ul>
      </div>
    )
  },
)

ItemList.displayName = 'ItemList'

export interface ItemListItemRef {
  animateIn: () => void
  animateOut: () => void
}
interface ItemListItemProps {
  item: SanityItemListItem
  index: number
}

const ItemListItem = forwardRef<ItemListItemRef, ItemListItemProps>(({ item, index }, ref) => {
  const containerRef = useRef<HTMLLIElement>(null)
  const lineAnimationRef = useRef<LineAnimationRef>(null)
  const splitTextRef = useRef<SplitTextRef>(null)
  const fadeInRef = useRef<FadeInRef>(null)
  const delay = index * 0.2

  useImperativeHandle(ref, () => ({
    animateIn: () => {
      if (lineAnimationRef.current) {
        lineAnimationRef.current.animateIn()
      }
      if (splitTextRef.current) {
        splitTextRef.current.animateIn()
      }
      if (fadeInRef.current) {
        fadeInRef.current.animateIn()
      }
    },
    animateOut: () => {
      if (lineAnimationRef.current) {
        lineAnimationRef.current.animateOut()
      }
      if (splitTextRef.current) {
        splitTextRef.current.animateOut()
      }
      if (fadeInRef.current) {
        fadeInRef.current.animateOut()
      }
    },
  }))

  return (
    <li
      ref={containerRef}
      className={styles.item}
    >
      <LineAnimation
        ref={lineAnimationRef}
        position="top"
        animateFrom="left"
        inConfig={{
          delay,
        }}
      />
      <SplitTextComponent
        ref={splitTextRef}
        className={styles.itemTitle}
        inConfig={{
          delay,
        }}
      >
        <div>{item.title}</div>
      </SplitTextComponent>
      {item.description && (
        <FadeIn
          ref={fadeInRef}
          className={styles.itemDescription}
          inConfig={{
            delay,
          }}
        >
          <RichText content={item.description} />
        </FadeIn>
      )}
    </li>
  )
})

ItemListItem.displayName = 'ItemListItem'

export default ItemList
