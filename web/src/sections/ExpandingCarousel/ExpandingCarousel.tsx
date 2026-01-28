'use client'

import classnames from 'classnames'
import styles from './ExpandingCarousel.module.scss'
import SanityImage from '@/components/SanityImage/SanityImage'
import { useCallback, useEffect, useMemo, useRef, forwardRef, useImperativeHandle, useState } from 'react'
import Link from '@/components/Link/Link'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import ArrowButton, { ArrowButtonRef } from '@/components/ArrowButton/ArrowButton'
import gsap from 'gsap'
import useWindowResize from '@/hooks/use-window-resize'
import useInView from '@/hooks/use-in-view'
import { Draggable } from 'gsap/dist/Draggable'
import useBreakpoint from '@/hooks/use-breakpoint'
import { lerp } from '@/utils'
import FadeIn from '@/components/FadeIn/FadeIn'
import ColorBar, { ColorBarRef } from '@/components/ColorBar/ColorBar'
import MaskReveal, { MaskRevealRef } from '@/components/MaskReveal/MaskReveal'
import { SanityCustomCard } from '@/types/sanity/SanityCustomCard'

gsap.registerPlugin(Draggable)

interface CalculationsInterface {
  bigWidth: number
  smallWidth: number
  height: number
  widthDifference: number
  maxX: number
}

const ExpandingCarousel = ({ className, items, numberPrefix }: SanityExpandingCarousel) => {
  const calculationBigRef = useRef<HTMLDivElement | null>(null)
  const [calculations, setCalculations] = useState<CalculationsInterface | null>(null)
  const resizeKey = useWindowResize()
  const cardRefs = useRef<CarouselCardRef[]>([])
  const { isInView, setElementToObserve } = useInView({ fireOnce: false })
  const contentListRef = useRef<HTMLDivElement | null>(null)
  const contentListInnerRef = useRef<HTMLDivElement | null>(null)
  const draggableRef = useRef<Draggable[]>([])
  const allowSetActiveOnDrag = useRef(false)
  const dragDistanceActiveTarget = useRef(0)
  const dragDistanceTarget = useRef(0)
  const dragDistanceCurrent = useRef(0)
  const dragDistanceActiveCurrent = useRef(0)
  const { isMobile, breakpoint } = useBreakpoint()
  const [allowRaf, setAllowRaf] = useState(false)
  const lerpLevel = useMemo(() => {
    if (isMobile) return 0.11
    return 0.06
  }, [isMobile])

  const getCalculations = useCallback(() => {
    if (!calculationBigRef.current) return null
    if (!cardRefs?.current?.length) return null

    const height = Math.max(...cardRefs.current.map(ref => ref.containerRef?.offsetHeight || 0))
    const bigWidth = calculationBigRef.current.offsetWidth

    let smallWidth = bigWidth * 0.65

    if (breakpoint?.name === 'laptop') {
      smallWidth = bigWidth * 0.8
    }

    if (isMobile) {
      smallWidth = bigWidth
    }

    const widthDifference = bigWidth - smallWidth
    const maxX = (cardRefs.current.length - 1) * bigWidth

    return {
      bigWidth,
      smallWidth,
      height,
      widthDifference,
      maxX,
    }
  }, [breakpoint?.name, isMobile])

  const killDraggable = useCallback(() => {
    if (draggableRef.current?.length) {
      draggableRef.current.forEach(ref => {
        ref.kill()
      })
    }
  }, [])

  const initializeDraggable = useCallback(() => {
    killDraggable()

    draggableRef.current = Draggable.create(contentListRef.current, {
      type: 'x',
      edgeResistance: 0.2,
      onDrag() {
        let multiplier = 2
        if (isMobile) multiplier = 2
        allowSetActiveOnDrag.current = true
        dragDistanceActiveTarget.current = (this.endX - this.startX) * -1 * multiplier
      },
      onDragEnd() {
        if (!calculations) return

        let snappedDistance = gsap.utils.snap(
          calculations?.bigWidth || 0,
          dragDistanceTarget.current + dragDistanceActiveTarget.current,
        )

        snappedDistance = gsap.utils.clamp(0, calculations?.maxX || 0, snappedDistance)

        // dragDistanceTarget.current = dragDistanceTarget.current + dragDistanceActiveTarget.current
        dragDistanceTarget.current = snappedDistance
        dragDistanceActiveTarget.current = 0
      },
    })
  }, [isMobile, calculations, killDraggable])

  const raf = useCallback(() =>
    // time: number
    {
      if (!cardRefs.current.length) return
      if (!calculations) return

      dragDistanceCurrent.current = lerp(dragDistanceCurrent.current, dragDistanceTarget.current, lerpLevel)
      dragDistanceActiveCurrent.current = lerp(
        dragDistanceActiveCurrent.current,
        dragDistanceActiveTarget.current,
        lerpLevel,
      )

      const xOffset = (dragDistanceCurrent.current + dragDistanceActiveCurrent.current) * -1

      gsap.set(contentListInnerRef.current, {
        x: xOffset,
      })

      cardRefs.current.forEach(ref => {
        const el = ref.containerRef
        if (!el) return

        const distanceToEdge = el.getBoundingClientRect().left
        const distanceToEdgeNormalized = gsap.utils.mapRange(
          -calculations.bigWidth,
          calculations.bigWidth,
          0,
          1,
          distanceToEdge,
        )
        const distanceToEdgeNormalizedClamped = gsap.utils.clamp(0, 1, distanceToEdgeNormalized)

        // const xOffset = calculations.widthDifference
        // const x = distanceToEdgeNormalizedClamped * xOffset

        // gsap.set(el, {
        //   x,
        // })

        const timelineProgress = distanceToEdgeNormalizedClamped

        if (ref.timeline) {
          ref.timeline.progress(timelineProgress)
        }
      })
    }, [calculations, lerpLevel])

  useEffect(() => {
    setAllowRaf(false)

    killDraggable()

    cardRefs.current.forEach(ref => {
      if (ref) {
        ref.resetCard()
      }
    })

    gsap.set(contentListInnerRef.current, {
      x: 0,
    })

    dragDistanceActiveTarget.current = 0
    dragDistanceTarget.current = 0
    dragDistanceCurrent.current = 0
    dragDistanceActiveCurrent.current = 0

    const calculations = getCalculations()

    if (!calculations) return

    setCalculations(calculations)

    setTimeout(() => {
      setAllowRaf(true)
    }, 10)

    // eslint-disable-next-line no-console
  }, [getCalculations, resizeKey, killDraggable])

  useEffect(() => {
    initializeDraggable()
  }, [initializeDraggable])

  // INSERT_YOUR_CODE
  // We will use gsap's ticker to add or remove the raf function depending on the presence of calculations
  useEffect(() => {
    gsap.ticker.remove(raf)

    if (!allowRaf) return

    raf()

    if (!isInView) return

    gsap.ticker.add(raf)

    return () => {
      gsap.ticker.remove(raf)
    }
  }, [calculations, isInView, raf, allowRaf])

  if (!items?.length) return null

  return (
    <div
      className={classnames(styles.ExpandingCarousel, className)}
      style={
        {
          '--big-width': `${calculations?.bigWidth}px`,
          '--small-width': `${calculations?.smallWidth}px`,
          '--width-difference': `${calculations?.widthDifference}px`,
        } as React.CSSProperties
      }
      ref={ref => {
        setElementToObserve(ref)
      }}
    >
      <LineAnimation
        position="top"
        animateFrom="left"
        animateInView
        longerDuration
      />
      <div className={styles.calculations}>
        <div
          className={styles.calculations__big}
          ref={calculationBigRef}
        />
        <div />
      </div>
      <div
        className={styles.contentList}
        ref={contentListRef}
      >
        <div
          className={styles.contentListInner}
          ref={contentListInnerRef}
        >
          {items.map((item, index) => (
            <CarouselCard
              ref={ref => {
                if (ref) {
                  cardRefs.current[index] = ref
                }
              }}
              key={index}
              index={index}
              numberPrefix={numberPrefix}
              calculations={calculations}
              mainContainerInView={isInView}
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

ExpandingCarousel.displayName = 'ExpandingCarousel'

export default ExpandingCarousel

type CarouselCardProps = (SanityCard | SanityCustomCard) & {
  className?: string
  index: number
  numberPrefix?: string
  calculations: CalculationsInterface | null
  mainContainerInView?: boolean
}

export type CarouselCardRef = {
  containerRef: HTMLDivElement | null
  timeline: GSAPTimeline | null
  resetCard: () => void
}

const CarouselCard = forwardRef<CarouselCardRef, CarouselCardProps>(
  (
    { className, _type, title, image, description, index, numberPrefix, calculations, mainContainerInView, ...rest },
    ref,
  ) => {
    const numberFormatted = numberPrefix ? `${numberPrefix}${index + 1}` : index + 1
    const timelineRef = useRef<GSAPTimeline | null>(null)
    const innerRef = useRef<HTMLAnchorElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const innerContentRef = useRef<HTMLDivElement | null>(null)
    const imageContainerInnerRef = useRef<HTMLDivElement | null>(null)
    const colorBarRef = useRef<ColorBarRef>(null)
    const arrowButtonRef = useRef<ArrowButtonRef>(null)
    const [isHovered, setIsHovered] = useState(false)
    const maskRevealRef = useRef<MaskRevealRef | null>(null)
    const animatedInMask = useRef(false)
    const { isMobile } = useBreakpoint()

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    useEffect(() => {
      if (mainContainerInView && !animatedInMask.current) {
        animatedInMask.current = true
        maskRevealRef.current?.animateIn()
      }
    }, [mainContainerInView])

    useEffect(() => {
      if (colorBarRef.current) {
        colorBarRef.current[isHovered ? 'animateIn' : 'animateOut']()
      }

      if (arrowButtonRef.current) {
        arrowButtonRef.current.setIsHover(isHovered)
      }
    }, [isHovered])

    const resetCard = () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }

      if (containerRef.current && imageContainerInnerRef.current) {
        gsap.set([containerRef.current, imageContainerInnerRef.current], {
          clearProps: 'width, height',
        })
      }
    }

    useImperativeHandle(ref, () => ({
      containerRef: containerRef.current,
      timeline: timelineRef.current,
      resetCard,
    }))

    useEffect(() => {
      resetCard()

      timelineRef.current = gsap.timeline({ paused: true })

      const duration = 0.5

      timelineRef.current.fromTo(
        containerRef.current,
        {
          width: calculations?.bigWidth,
        },
        {
          width: calculations?.bigWidth,
          duration,
          ease: 'none',
        },
        '0',
      )

      timelineRef.current.fromTo(
        imageContainerInnerRef.current,
        {
          height: '100%',
        },
        {
          height: '100%',
          duration,
          ease: 'none',
        },
        '0',
      )

      timelineRef.current.fromTo(
        imageContainerInnerRef.current,
        {
          height: '100%',
        },
        {
          height: '50%',
          duration,
          ease: 'none',
        },
        duration,
      )

      timelineRef.current.fromTo(
        containerRef.current,
        {
          width: calculations?.bigWidth,
        },
        {
          width: calculations?.smallWidth,
          ease: 'none',
        },
        duration,
      )

      return () => {
        if (timelineRef.current) {
          timelineRef.current.kill()
        }
      }
    }, [index, calculations])

    const linkObject = useMemo(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _rest = rest as any
      if (_rest?.link) {
        return _rest.link
      }

      return {
        linkType: 'internal',
        link: {
          _type,
          slug: _rest?.slug,
        },
      }
    }, [_type, rest])

    if (!title) return null

    return (
      <div
        ref={containerRef}
        className={classnames(styles.Card, className, { [styles.isHovered]: isHovered })}
        style={
          {
            '--card-width-big': `${calculations?.bigWidth}px`,
            '--card-width-small': `${calculations?.smallWidth}px`,
          } as React.CSSProperties
        }
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          ref={innerRef}
          link={linkObject as SanityLink}
          className={styles.card__inner}
        >
          <div ref={innerContentRef}>
            <div className={styles.card__topContent}>
              <LineAnimation
                position="right"
                animateFrom="top"
                size={isMobile ? 'tiny' : 'small'}
                animateInView
                longerDuration
                inConfig={{
                  delay: index * 0.075,
                }}
              />
              <FadeIn
                animateInView
                className={styles.card__number}
              >
                {numberFormatted}
              </FadeIn>
            </div>
            <div className={styles.card__imageContainer}>
              <div
                ref={imageContainerInnerRef}
                className={styles.card__imageContainerInner}
              >
                <MaskReveal
                  className={styles.card__imageMaskReveal}
                  animateWhenInView={false}
                  ref={maskRevealRef}
                  inConfig={{
                    delay: index * 0.075,
                  }}
                >
                  <SanityImage
                    source={image}
                    className={styles.card__image}
                    aspectRatio={1}
                    columns={{
                      tablet: 4,
                      xs: 12,
                    }}
                  />
                </MaskReveal>
              </div>
            </div>
            <div className={styles.card__textContent}>
              {!isMobile && (
                <LineAnimation
                  position="top"
                  animateFrom="left"
                  animateInView
                />
              )}

              <FadeIn
                animateInView
                className={styles.card__titleContainer}
              >
                <span className={styles.card__title}>{title}</span>
              </FadeIn>
              {description && (
                <FadeIn
                  animateInView
                  className={styles.card__description}
                >
                  <p className={styles.card__description}>{description}</p>
                </FadeIn>
              )}
              <FadeIn
                animateInView
                className={styles.card__arrowButtonContainer}
              >
                <ColorBar
                  ref={colorBarRef}
                  className={styles.card__colorBar}
                />
                <ArrowButton
                  disableOnHover
                  iconName="arrowRight"
                  className={styles.card__arrowButton}
                  hiddenIconClassName={styles.card__arrowButtonHiddenIcon}
                  element="span"
                  ref={arrowButtonRef}
                />
              </FadeIn>
            </div>
          </div>
        </Link>
      </div>
    )
  },
)

CarouselCard.displayName = 'CarouselCard'
