'use client'

import { forwardRef, useImperativeHandle, useRef, useEffect, useState, useMemo } from 'react'
import classnames from 'classnames'
import styles from './TextTickerSection.module.scss'
import useWindowResize from '@/hooks/use-window-resize'
import gsap from 'gsap'
import useInView from '@/hooks/use-in-view'
import SplitTextComponent, { SplitTextRef } from '@/components/SplitTextComponent/SplitTextComponent'
import FadeIn from '@/components/FadeIn/FadeIn'
import useBreakpoint from '@/hooks/use-breakpoint'

export interface TickerItemRef {
  getElement: () => HTMLDivElement | null
}

const TextTickerSection = ({ className, title, rows }: SanityTextTickerSection) => {
  const tickerItemRefs = useRef<(TickerItemRef | null)[][]>([])
  const tickerRowGroupRefs = useRef<(HTMLDivElement | null)[]>([])
  const tickerRowInnerRefs = useRef<(HTMLDivElement | null)[]>([])
  const timelinesRef = useRef<gsap.core.Timeline[]>([])
  const [duplicationsByRow, setDuplicationsByRow] = useState<number[]>([])
  const [groupWidthsByRow, setGroupWidthsByRow] = useState<number[]>([])
  const resizeKey = useWindowResize()
  const { isInView, setElementToObserve } = useInView({ fireOnce: false })
  const { isMobile } = useBreakpoint()

  // Calculate rows - on mobile, ensure minimum of 3 rows
  const calculatedRows = useMemo(() => {
    if (!rows?.length) return rows

    // On mobile, if there are only 2 rows, split items into 3 groups
    if (isMobile && rows.length === 2) {
      // Get all items from both rows
      const allItems: string[] = []
      rows.forEach(row => {
        if (row.items) {
          allItems.push(...row.items)
        }
      })

      // Split items into 3 groups as evenly as possible
      const totalItems = allItems.length
      const groups: string[][] = [[], [], []]

      allItems.forEach((item, index) => {
        // Distribute items evenly across 3 groups
        // This ensures items are distributed as evenly as possible
        const groupIndex = Math.floor((index * 3) / totalItems)
        groups[Math.min(groupIndex, 2)].push(item)
      })

      // Create new row objects with the same structure
      return groups.map((items, index) => ({
        _key: `calculated-row-${index}`,
        items,
      }))
    }

    // Otherwise, return rows as-is
    return rows
  }, [rows, isMobile])

  // Calculate duplications needed for each row
  useEffect(() => {
    if (!calculatedRows?.length) return

    const windowWidth = window.innerWidth
    const duplications: number[] = []
    const groupWidths: number[] = []

    calculatedRows.forEach((_, rowIndex) => {
      const rowInner = tickerRowGroupRefs.current[rowIndex]
      if (!rowInner) {
        duplications.push(1)
        groupWidths.push(0)
        return
      }

      // Calculate total width of all items in this row
      let totalWidth = 0
      tickerItemRefs.current[rowIndex]?.forEach(itemRef => {
        const element = itemRef?.getElement()
        if (element) {
          totalWidth += element.offsetWidth
        }
      })

      // Store the group width
      groupWidths.push(totalWidth)

      // Calculate how many duplications we need
      let duplicationCount = 2
      const minWidth = windowWidth * 2
      while (totalWidth * duplicationCount < minWidth) {
        duplicationCount++
      }

      duplications.push(duplicationCount)
    })

    setDuplicationsByRow(duplications)
    setGroupWidthsByRow(groupWidths)
  }, [calculatedRows, resizeKey])

  // Animate ticker rows
  useEffect(() => {
    if (!calculatedRows?.length || !groupWidthsByRow.length) return

    // Kill existing timelines
    timelinesRef.current.forEach(timeline => timeline?.kill())
    timelinesRef.current = []

    if (!isInView) return

    calculatedRows.forEach((_, rowIndex) => {
      const tickerRowInner = tickerRowInnerRefs.current[rowIndex]
      const groupWidth = groupWidthsByRow[rowIndex]

      if (!tickerRowInner || !groupWidth) return

      // Determine direction based on even/odd index
      const isEven = rowIndex % 2 === 0
      const direction = isEven ? -1 : 1

      // Calculate duration: 1000px every 5 seconds
      const duration = (groupWidth / 300) * 5

      // Create timeline
      const timeline = gsap.timeline({
        repeat: -1,
      })

      timeline.to(tickerRowInner, {
        x: direction * groupWidth,
        duration,
        ease: 'none',
      })

      // Set initial position for seamless loop
      gsap.set(tickerRowInner, { x: 0 })

      timelinesRef.current[rowIndex] = timeline
    })

    return () => {
      timelinesRef.current.forEach(timeline => timeline?.kill())
      timelinesRef.current = []
    }
  }, [calculatedRows, groupWidthsByRow, isInView])

  if (!calculatedRows?.length) {
    return null
  }

  // Initialize refs array for each row
  if (tickerItemRefs.current.length !== calculatedRows.length) {
    tickerItemRefs.current = calculatedRows.map(() => [])
  }

  return (
    <div
      className={classnames(styles.TextTickerSection, className)}
      ref={ref => {
        setElementToObserve(ref)
      }}
    >
      {title && (
        <FadeIn
          animateInView
          className={styles.titleContainer}
        >
          <h2 className={styles.title}>{title}</h2>
        </FadeIn>
      )}
      <div className={styles.tickerRows}>
        {calculatedRows.map((row, rowIndex) => {
          const duplications = duplicationsByRow[rowIndex] || 1

          return (
            <div
              key={row._key || rowIndex}
              className={styles.tickerRow}
            >
              <div
                ref={el => {
                  tickerRowInnerRefs.current[rowIndex] = el
                }}
                className={styles.tickerRowInner}
              >
                {Array.from({ length: duplications }).map((_, dupIndex) => (
                  <div
                    key={`${row._key}_${dupIndex}`}
                    ref={el => {
                      // Only store ref for the first duplication
                      if (dupIndex === 0) {
                        tickerRowGroupRefs.current[rowIndex] = el
                      }
                    }}
                    className={styles.tickerRowGroup}
                  >
                    {row.items?.map((item, itemIndex) => (
                      <TickerItem
                        key={`${row._key}_${dupIndex}_${itemIndex}`}
                        ref={el => {
                          // Only store refs for the first duplication
                          if (dupIndex === 0) {
                            if (!tickerItemRefs.current[rowIndex]) {
                              tickerItemRefs.current[rowIndex] = []
                            }
                            tickerItemRefs.current[rowIndex][itemIndex] = el
                          }
                        }}
                        containerInView={isInView}
                        text={item}
                        index={itemIndex}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

TextTickerSection.displayName = 'TextTickerSection'

// TickerItem component
const TickerItem = forwardRef<TickerItemRef, { text: string; containerInView: boolean; index: number }>(
  ({ text, containerInView }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const splitTextRef = useRef<SplitTextRef | null>(null)
    const animatedIn = useRef(false)

    useEffect(() => {
      if (!containerInView) return
      if (animatedIn.current) return
      animatedIn.current = true
      if (splitTextRef.current) {
        splitTextRef.current.animateIn()
      }
    }, [containerInView])

    useImperativeHandle(ref, () => ({
      getElement: () => containerRef.current,
    }))

    return (
      <div
        ref={containerRef}
        className={styles.tickerItem}
      >
        <SplitTextComponent ref={splitTextRef}>
          <span className={styles.tickerItemText}>{text}</span>
        </SplitTextComponent>
      </div>
    )
  },
)

TickerItem.displayName = 'TickerItem'

export default TextTickerSection
