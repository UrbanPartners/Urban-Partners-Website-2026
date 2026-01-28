import { ReactNode, useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react'
import classnames from 'classnames'
import gsap from 'gsap'

import useInView from '@/hooks/use-in-view'

import styles from './MaskReveal.module.scss'

type MaskRevealProps = {
  className?: string
  children: ReactNode
  direction?: 'FROM_TOP' | 'FROM_BOTTOM'
  maskType?: 'default' | 'twoColumns'
  id?: string
  animateWhenInView?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inConfig?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outConfig?: any
  showInitially?: boolean
  hasSubtleBg?: boolean
  longerDuration?: boolean
  revertOnAnimateInComplete?: boolean
}

export interface MaskRevealRef {
  animateIn: () => void
  animateOut: () => void
  getElement: () => HTMLDivElement | null
}

const DURATION = 0.8
const DURATION_LONGER = 1.3
const EASE = 'Power3.easeInOut'

const MaskReveal = forwardRef<MaskRevealRef, MaskRevealProps>(
  (
    {
      className,
      children,
      direction = 'FROM_TOP',
      maskType = 'default',
      id,
      animateWhenInView = false,
      inConfig = {},
      outConfig = {},
      showInitially = false,
      hasSubtleBg = false,
      longerDuration = false,
      revertOnAnimateInComplete = false,
    },
    ref,
  ) => {
    const { isInView, setElementToObserve } = useInView()
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [isOpen, setIsOpen] = useState(showInitially)
    const [revert, setRevert] = useState(false)

    const animateIn = () => {
      if (!containerRef.current) return
      setIsOpen(true)

      gsap.killTweensOf(containerRef.current)

      const duration = longerDuration ? DURATION_LONGER : DURATION

      if (maskType === 'default') {
        let leftY = '0'
        let rightY = '0'

        if (direction === 'FROM_TOP') {
          leftY = '100%'
          rightY = '100%'
        }

        gsap.to(containerRef.current, {
          '--left-y': leftY,
          '--right-y': rightY,
          duration,
          ease: EASE,
          ...inConfig,
        })
      }

      if (maskType === 'twoColumns') {
        let leftY1 = '0'
        let leftY2 = '0'
        let rightY1 = '0'
        let rightY2 = '0'

        if (direction === 'FROM_TOP') {
          leftY1 = '100%'
          leftY2 = '100%'
          rightY1 = '100%'
          rightY2 = '100%'
        }

        gsap.to(containerRef.current, {
          '--left-y-1': leftY1,
          '--left-y-2': leftY2,
          duration,
          ease: EASE,
          ...inConfig,
        })

        gsap.to(containerRef.current, {
          '--right-y-1': rightY1,
          '--right-y-2': rightY2,
          delay: inConfig.secondColumnDelay ? inConfig.secondColumnDelay : duration * 0.2,
          duration,
          ease: EASE,
          ...inConfig,
          onComplete: () => {
            if (revertOnAnimateInComplete) {
              setRevert(true)
            }
          },
        })
      }
    }

    const animateOut = () => {
      if (!containerRef.current) return
      setIsOpen(false)

      gsap.killTweensOf(containerRef.current)

      const duration = longerDuration ? DURATION_LONGER : DURATION

      if (maskType === 'default') {
        let leftY = '100%'
        let rightY = '100%'

        if (direction === 'FROM_TOP') {
          leftY = '0%'
          rightY = '0%'
        }

        gsap.to(containerRef.current, {
          '--left-y': leftY,
          '--right-y': rightY,
          duration,
          ease: EASE,
          ...outConfig,
        })
      }

      if (maskType === 'twoColumns') {
        let leftY1 = '100%'
        let leftY2 = '100%'
        let rightY1 = '100%'
        let rightY2 = '100%'

        if (direction === 'FROM_TOP') {
          leftY1 = '0%'
          leftY2 = '0%'
          rightY1 = '0%'
          rightY2 = '0%'
        }

        gsap.to(containerRef.current, {
          '--left-y-1': leftY1,
          '--left-y-2': leftY2,
          duration,
          ease: EASE,
          ...outConfig,
        })

        gsap.to(containerRef.current, {
          '--right-y-1': rightY1,
          '--right-y-2': rightY2,
          delay: outConfig.secondColumnDelay ? outConfig.secondColumnDelay : duration * 0.075,
          duration,
          ease: EASE,
          ...outConfig,
        })
      }
    }

    useImperativeHandle(ref, () => ({
      animateIn,
      animateOut,
      getElement: () => containerRef.current,
    }))

    useEffect(() => {
      if (!animateWhenInView) return
      if (isInView) {
        animateIn()
      } else {
        animateOut()
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animateWhenInView, isInView])

    return (
      <div
        ref={ref => {
          if (animateWhenInView) {
            setElementToObserve(ref)
          }

          containerRef.current = ref
        }}
        suppressHydrationWarning={true}
        id={id}
        data-mask-type={maskType}
        className={classnames(
          styles.MaskReveal,
          className,
          { [styles[direction]]: direction },
          {
            [styles.showInitially]: showInitially || revert,
          },
          { [styles.isOpen]: isOpen },
          { [styles.hasSubtleBg]: hasSubtleBg },
        )}
      >
        {children}
      </div>
    )
  },
)

MaskReveal.displayName = 'MaskReveal'

export default MaskReveal
