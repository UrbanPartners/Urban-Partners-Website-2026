'use client'

import classnames from 'classnames'
import styles from './TimelineSection.module.scss'
import SplitTextComponent, { SplitTextRef } from '@/components/SplitTextComponent/SplitTextComponent'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import SanityImage from '@/components/SanityImage/SanityImage'
import FadeIn from '@/components/FadeIn/FadeIn'
import RichText from '@/components/RichText/RichText'
import GridOverlay from '@/sections/OurStoryScroller/GridOverlay/GridOverlay'
import { useOurStoryScrollerContext } from '@/sections/OurStoryScroller/OurStoryScrollerContext'
import useInView from '@/hooks/use-in-view'
import gsap from 'gsap'
import MaskReveal from '@/components/MaskReveal/MaskReveal'
import useBreakpoint from '@/hooks/use-breakpoint'

const DEBUG = false

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TimelineSection = ({ yearPrefix, subtitle, itemsByYear }: SanityOurStoryScrollerTimelineSection) => {
  const { caseStudyScaleoutDistance } = useOurStoryScrollerContext()
  const { isInView, setElementToObserve } = useInView()
  const timelineYearRef = useRef<TimelineYearRef | null>(null)
  const { isMobile } = useBreakpoint()

  const allItems = useMemo(() => {
    const _allItems = itemsByYear.flatMap((item, i) => {
      return item.items.map((_item, _i) => ({
        ..._item,
        yearSuffix: _i === 0 ? item.yearSuffix : null,
        previousYearSuffix: _i === 0 ? itemsByYear[i - 1]?.yearSuffix : null,
      }))
    })

    if (isMobile) {
      return {
        left: [],
        right: _allItems,
      }
    }

    const groupedItems = _allItems.reduce(
      (acc, item, idx) => {
        if (idx % 2 === 1) {
          acc.right.push(item)
        } else {
          acc.left.push(item)
        }
        return acc
      },
      { left: [], right: [] } as { left: typeof _allItems; right: typeof _allItems },
    )
    return groupedItems
  }, [itemsByYear, isMobile])

  if ((!allItems?.left?.length && !allItems?.right?.length) || !yearPrefix) {
    return null
  }

  return (
    <div
      className={classnames(styles.TimelineSection)}
      style={{
        marginTop: `calc(-${caseStudyScaleoutDistance}px - 100svh)`,
      }}
    >
      <GridOverlay
        className={styles.gridOverlay}
        hasLeftLine
        hasRightLine
        startFull
      />
      <TimelineYear
        {...{ yearPrefix, itemsByYear, subtitle }}
        ref={timelineYearRef}
        mastContainerInView={isInView}
      />
      <div className={styles.inner}>
        <div
          className={styles.itemsContainer}
          ref={ref => {
            setElementToObserve(ref)
          }}
        >
          <div className={styles.itemsContainer__left}>
            {allItems?.left?.map((item, index) => (
              <TimelineYearItem
                key={`${item._key}-${index}`}
                {...item}
                firstSuffix={allItems?.left?.[0]?.yearSuffix}
                mastContainerInView={isInView}
                timelineYearRef={timelineYearRef.current}
              />
            ))}
          </div>
          <div className={styles.itemsContainer__spacer} />
          <div className={styles.itemsContainer__right}>
            {allItems?.right?.map((item, index) => (
              <TimelineYearItem
                key={`${item._key}-${index}`}
                {...item}
                firstSuffix={allItems?.left?.[0]?.yearSuffix}
                mastContainerInView={isInView}
                timelineYearRef={timelineYearRef.current}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

TimelineSection.displayName = 'TimelineSection'

type TimelineYearProps = SanityOurStoryScrollerTimelineSection & {
  className?: string
  mastContainerInView?: boolean
}

type TimelineYearRef = {
  getElement: () => HTMLDivElement | null
  animateByYear: (yearSuffix: string) => void
}

const TimelineYear = forwardRef<TimelineYearRef, TimelineYearProps>(
  ({ yearPrefix, itemsByYear, className, subtitle, mastContainerInView }: TimelineYearProps, ref) => {
    const suffixes = itemsByYear.map(item => item.yearSuffix)
    const yearSuffixes = suffixes.map(suffix => suffix.split(''))
    const containerRef = useRef<HTMLDivElement | null>(null)
    const charRefsByYear = useRef<Record<string, HTMLSpanElement[]>>({})
    const subtitleRef = useRef<SplitTextRef | null>(null)

    useEffect(() => {
      if (!mastContainerInView) return
      if (!subtitleRef.current) return
      subtitleRef.current.animateIn()
    }, [mastContainerInView, subtitleRef])

    const animateByYear = useCallback(
      (activeYearSuffix: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const animateByMap: any = {}
        const currentYearParsed = parseInt(activeYearSuffix)
        suffixes.forEach(suffix => {
          const suffixParsed = parseInt(suffix)
          if (suffixParsed === currentYearParsed) {
            animateByMap[suffix] = 'current'
            return
          }
          if (suffixParsed < currentYearParsed) {
            animateByMap[suffix] = 'before'
          } else {
            animateByMap[suffix] = 'after'
          }
        })

        Object.keys(charRefsByYear.current).forEach(yearPrefix => {
          const chars = charRefsByYear.current[yearPrefix]
          if (!chars?.length) return
          chars.forEach((char, index) => {
            if (!char) return

            const animateBy = animateByMap[yearPrefix]
            if (!animateBy) return

            gsap.killTweensOf(char)

            const baseConfig = {
              delay: index * 0.05,
              duration: 0.3,
              ease: 'Power3.easeOut',
            }

            let y: string | number = 0

            if (animateBy === 'before') {
              y = '-110%'
            } else if (animateBy === 'after') {
              y = '110%'
            }

            gsap.to(char, {
              ...baseConfig,
              y,
            })
          })
        })
      },
      [suffixes],
    )

    useImperativeHandle(ref, () => ({
      getElement: () => containerRef.current,
      animateByYear: (yearSuffix: string) => animateByYear(yearSuffix),
    }))

    return (
      <div
        ref={containerRef}
        className={classnames(styles.TimelineYear, className)}
      >
        <div className={styles.timelineYear__year}>
          <span className={styles.timelineYear__yearPrefix}>{yearPrefix}</span>
          <span className={styles.timelineYear__yearSuffixesList}>
            {yearSuffixes.map((yearSuffixArr, i) => {
              return (
                <span
                  className={styles.timelineYear__yearSuffix}
                  key={`${yearSuffixArr.join('')}-${i}`}
                >
                  {yearSuffixArr.map((char, __i) => {
                    return (
                      <span
                        key={`${yearSuffixArr.join('')}-${i}-${__i}`}
                        className={styles.timelineYear__yearSuffixChar}
                        ref={ref => {
                          const joinedSuffix = yearSuffixArr.join('')
                          if (ref && joinedSuffix) {
                            if (!charRefsByYear.current[joinedSuffix]) {
                              charRefsByYear.current[joinedSuffix] = []
                            }
                            charRefsByYear.current[joinedSuffix][__i] = ref
                          }
                        }}
                      >
                        {char}
                      </span>
                    )
                  })}
                </span>
              )
            })}
          </span>
        </div>
        <div className={styles.timelineYear__subtitleContainer}>
          <SplitTextComponent
            ref={subtitleRef}
            revertOnAnimateIn={false}
          >
            <p className={styles.timelineYear__subtitle}>{subtitle}</p>
          </SplitTextComponent>
        </div>
      </div>
    )
  },
)

TimelineYear.displayName = 'TimelineYear'

type TimelineYearItemProps = SanityOurStoryScrollerTimelineSectionItem & {
  className?: string
  yearSuffix?: string | null
  setActiveYearSuffix?: (yearSuffix: string) => void
  firstSuffix?: string | null
  previousYearSuffix?: string | null
  mastContainerInView?: boolean
  timelineYearRef?: TimelineYearRef | null
}

const TimelineYearItem = ({
  image,
  title,
  description,
  imageLayout,
  className,
  yearSuffix,
  firstSuffix,
  previousYearSuffix,
  mastContainerInView,
  timelineYearRef,
}: TimelineYearItemProps) => {
  const { setElementToObserve, onEnterKey, onLeaveBackKey } = useInView({
    fireOnce: false,
    scrolltriggerStart: 'top bottom-=50%',
  })

  useEffect(() => {
    if (!onEnterKey) return
    if (!mastContainerInView) return
    if (!timelineYearRef) return
    if (!yearSuffix) return
    timelineYearRef.animateByYear(yearSuffix)
  }, [onEnterKey, yearSuffix, timelineYearRef, mastContainerInView])

  useEffect(() => {
    if (!onLeaveBackKey) return
    if (!mastContainerInView) return
    if (!timelineYearRef) return
    if (!previousYearSuffix) return
    if (firstSuffix === yearSuffix) return
    timelineYearRef.animateByYear(previousYearSuffix)
  }, [onLeaveBackKey, yearSuffix, timelineYearRef, mastContainerInView, firstSuffix, previousYearSuffix])

  return (
    <div
      className={classnames(styles.TimelineYearItem, className)}
      ref={ref => {
        setElementToObserve(ref)
      }}
      data-timeline-item-image-layout={imageLayout}
    >
      <div className={styles.timelineYearItem__inner}>
        {DEBUG && yearSuffix && <div className={styles.timelineYearItem__yearSuffixDebug}>20{yearSuffix}</div>}
        <MaskReveal
          hasSubtleBg
          animateWhenInView
          className={styles.timelineYearItem__imageContainer}
        >
          <SanityImage
            className={styles.timelineYearItem__image}
            source={image}
            aspectRatio={imageLayout === 'portrait' ? 319 / 352 : 576 / 352}
            columns={{
              tablet: imageLayout === 'portrait' ? 3 : 4,
              xs: 8,
            }}
          />
        </MaskReveal>
        <SplitTextComponent animateInView>
          <h3 className={styles.timelineYearItem__title}>{title}</h3>
        </SplitTextComponent>
        {!!description?.length && (
          <div className={styles.timelineYearItem__description}>
            <FadeIn animateInView>
              <RichText content={description} />
            </FadeIn>
          </div>
        )}
      </div>
    </div>
  )
}

TimelineYearItem.displayName = 'TimelineYearItem'

export default TimelineSection
