'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import classnames from 'classnames'
import styles from './PlusMinusAnimation.module.scss'
import gsap from 'gsap'

export interface PlusMinusAnimationRef {
  setCurrentSign: (sign: 'plus' | 'minus') => void
}

interface PlusMinusAnimationProps {
  className?: string
  element?: 'button' | 'span'
  htmlProps?: React.HTMLAttributes<HTMLButtonElement | HTMLSpanElement>
}

const PlusMinusAnimation = forwardRef<PlusMinusAnimationRef, PlusMinusAnimationProps>(
  ({ className, element = 'button', htmlProps }, ref) => {
    const containerRef = useRef<HTMLButtonElement | HTMLSpanElement>(null)
    const horizontalLineRef = useRef<HTMLSpanElement>(null)
    const verticalLineRef = useRef<HTMLSpanElement>(null)
    const [currentSign, setCurrentSignState] = useState<'plus' | 'minus'>('plus')
    const tweensRef = useRef<gsap.core.Tween[]>([])
    const Component = element === 'span' ? 'span' : 'button'
    const numberOfStatesSet = useRef(1)

    useImperativeHandle(ref, () => ({
      setCurrentSign: (sign: 'plus' | 'minus') => {
        setCurrentSignState(sign)
      },
    }))

    // Set initial rotation state
    useEffect(() => {
      if (horizontalLineRef.current) {
        gsap.set(horizontalLineRef.current, { rotation: 90 })
      }
      if (containerRef.current) {
        gsap.set(containerRef.current, { rotation: 0 })
      }
    }, [])

    useEffect(() => {
      if (!containerRef.current || !horizontalLineRef.current || !verticalLineRef.current) return

      // Kill all existing tweens
      tweensRef.current.forEach(tween => tween.kill())
      tweensRef.current = []

      const duration = 0.4
      const ease = 'Power2.easeOut'

      if (currentSign === 'minus') {
        // Rotate whole component 90deg
        const containerTween = gsap.to(containerRef.current, {
          rotation: numberOfStatesSet.current * 180,
          duration,
          ease,
        })
        tweensRef.current.push(containerTween)

        // Rotate the horizontal line (already at 90deg) another 90deg
        const horizontalTween = gsap.to(horizontalLineRef.current, {
          rotation: 0,
          duration,
          ease,
        })
        tweensRef.current.push(horizontalTween)
      } else {
        // Rotate back to plus
        const containerTween = gsap.to(containerRef.current, {
          rotation: numberOfStatesSet.current * 180,
          duration,
          ease,
        })

        tweensRef.current.push(containerTween)

        const horizontalTween = gsap.to(horizontalLineRef.current, {
          rotation: 90,
          duration,
          ease,
        })
        tweensRef.current.push(horizontalTween)
      }

      numberOfStatesSet.current += 1
    }, [currentSign])

    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={containerRef as any}
        className={classnames(styles.PlusMinusAnimation, className)}
        type={element === 'button' ? 'button' : undefined}
        {...htmlProps}
      >
        <span
          ref={verticalLineRef}
          className={styles.line}
        />
        <span
          ref={horizontalLineRef}
          className={classnames(styles.line, styles.horizontalLine)}
        />
      </Component>
    )
  },
)

PlusMinusAnimation.displayName = 'PlusMinusAnimation'

export default PlusMinusAnimation
