'use client'

import { CSSProperties, forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import classNames from 'classnames'
import styles from './GridOverlay.module.scss'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import gsap from 'gsap'

export interface GridOverlayRef {
  animateIn: () => void
  animateOut: () => void
  getElement: () => HTMLDivElement | null
}

interface GridOverlayProps {
  hasLeftLine?: boolean
  hasRightLine?: boolean
  hasMiddleLine?: boolean
  className?: string
  lineColor?: 'default' | string
  startFull?: boolean
}

const GridOverlay = forwardRef<GridOverlayRef, GridOverlayProps>(
  ({ hasLeftLine, hasRightLine, hasMiddleLine, className, lineColor = 'default', startFull = false }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const animateIn = (immediate = false) => {
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current)
        gsap[immediate ? 'set' : 'to'](containerRef.current, {
          opacity: 1,
          duration: 0.6,
          ease: 'Power3.easeOut',
        })
      }
    }

    const animateOut = () => {
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current)
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'Power3.easeOut',
        })
      }
    }

    useImperativeHandle(ref, () => ({
      getElement: () => containerRef.current,
      animateIn,
      animateOut,
    }))

    const lineColorStyle = useMemo(() => {
      if (lineColor === 'default') {
        return {}
      }

      return {
        '--line-color': lineColor,
      }
    }, [lineColor])

    useEffect(() => {
      if (startFull) {
        animateIn(true)
      }
    }, [startFull])

    return (
      <div
        ref={containerRef}
        className={classNames(styles.GridOverlay, className)}
        style={lineColorStyle as CSSProperties}
      >
        <div className={styles.GridOverlay__container} />
        {hasLeftLine && (
          <div className={styles.GridOverlay__container}>
            <LineAnimation
              position="left"
              animateFrom="top"
              startFull
              className={styles.GridOverlay__lineLeft}
            />
          </div>
        )}
        {hasRightLine && (
          <div className={styles.GridOverlay__container}>
            <LineAnimation
              position="left"
              animateFrom="top"
              startFull
              className={styles.GridOverlay__lineRight}
            />
          </div>
        )}
        {hasMiddleLine && (
          <LineAnimation
            position="top"
            animateFrom="left"
            startFull
            className={styles.GridOverlay__lineMiddle}
          />
        )}
      </div>
    )
  },
)

GridOverlay.displayName = 'GridOverlay'

export default GridOverlay
