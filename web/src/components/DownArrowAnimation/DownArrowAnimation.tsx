'use client'

import classnames from 'classnames'
import styles from './DownArrowAnimation.module.scss'
import Icon from '@/components/Icon/Icon'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import gsap from 'gsap'
import FadeIn, { FadeInRef } from '@/components/FadeIn/FadeIn'
import useInView from '@/hooks/use-in-view'

interface DownArrowAnimationProps {
  className?: string
  animateInView?: boolean
  disableAnimation?: boolean
}

export interface DownArrowAnimationRef {
  animateIn: () => void
  animateArrowLoop: () => void
}

const DownArrowAnimation = forwardRef<DownArrowAnimationRef, DownArrowAnimationProps>(
  ({ className, animateInView, disableAnimation }, ref) => {
    const iconRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<GSAPTimeline | null>(null)
    const fadeInRef = useRef<FadeInRef | null>(null)
    const [animationMode, setAnimationMode] = useState<'idle' | 'loop' | 'once'>(animateInView ? 'loop' : 'idle')
    const { isInView, setElementToObserve } = useInView()

    useImperativeHandle(ref, () => ({
      animateIn: () => {
        if (fadeInRef.current) {
          fadeInRef.current.animateIn()
        }
      },
      setAnimationMode: (mode: 'idle' | 'loop' | 'once') => {
        setAnimationMode(mode)
      },
      animateArrowLoop: () => {
        setAnimationMode('once')
      },
    }))

    useEffect(() => {
      if (!iconRef.current) return

      if (timelineRef.current) {
        timelineRef.current.kill()
      }

      if (disableAnimation) {
        return
      }

      if (animationMode === 'idle') {
        gsap.set(iconRef.current, { y: 0, opacity: 1 })
        return
      }

      timelineRef.current = gsap.timeline({
        repeat: animationMode === 'loop' ? -1 : 0,
        repeatDelay: 1.25,
        onComplete: animationMode === 'once' ? () => setAnimationMode('idle') : undefined,
      })

      const duration = 1
      const distance = 60

      // Fade out and move down
      timelineRef.current.to(iconRef.current, {
        y: `${distance}%`,
        opacity: 0,
        duration,
        ease: 'Power3.easeIn',
      })

      // Reset position to above (without showing)
      timelineRef.current.set(iconRef.current, {
        y: `${-distance}%`,
        opacity: 0,
      })

      // Fade in and move to center
      timelineRef.current.to(iconRef.current, {
        y: 0,
        opacity: 1,
        duration,
        ease: 'Power3.easeOut',
      })

      return () => {
        if (timelineRef.current) {
          timelineRef.current.kill()
        }
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animationMode])

    useEffect(() => {
      if (!animateInView) return
      if (isInView) {
        if (fadeInRef.current) {
          fadeInRef.current.animateIn()
          setAnimationMode('loop')
        }
      }
    }, [animateInView, isInView, disableAnimation])

    return (
      <FadeIn
        ref={_ref => {
          if (_ref) {
            fadeInRef.current = _ref
            setElementToObserve(_ref?.getElement())
          }
        }}
        className={classnames(styles.DownArrowAnimation, className)}
      >
        <div
          ref={iconRef}
          className={styles.iconContainer}
        >
          <Icon
            name="arrowDownLarge"
            className={styles.icon}
          />
        </div>
      </FadeIn>
    )
  },
)

DownArrowAnimation.displayName = 'DownArrowAnimation'

export default DownArrowAnimation
