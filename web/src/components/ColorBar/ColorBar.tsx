'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import classNames from 'classnames'
import gsap from 'gsap'
import styles from './ColorBar.module.scss'

export interface ColorBarRef {
  animateIn: () => void
  animateOut: () => void
}

export interface ColorBarProps {
  className?: string
  startFull?: boolean
  transformOrigin?: 'left' | 'right' | 'top' | 'bottom'
  duration?: number
  ease?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inConfig?: Record<string, any> | ((defaultConfig: any) => Record<string, any>)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outConfig?: Record<string, any> | ((defaultConfig: any) => Record<string, any>)
}

const ColorBar = forwardRef<ColorBarRef, ColorBarProps>(
  (
    {
      className,
      startFull = false,
      transformOrigin = 'left',
      duration = 0.3,
      ease = 'Power3.easeOut',
      inConfig,
      outConfig,
    },
    ref,
  ) => {
    const spanRef = useRef<HTMLSpanElement>(null)

    // Determine scale property and transform origin based on direction
    const isHorizontal = transformOrigin === 'left' || transformOrigin === 'right'
    const scaleProperty = isHorizontal ? 'scaleX' : 'scaleY'
    const transformOriginValue = transformOrigin

    useImperativeHandle(ref, () => ({
      animateIn: () => {
        if (!spanRef.current) return

        gsap.killTweensOf(spanRef.current)
        const defaultConfig = {
          [scaleProperty]: 1,
          duration,
          ease,
        }

        const config =
          typeof inConfig === 'function'
            ? { ...defaultConfig, ...inConfig(defaultConfig) }
            : { ...defaultConfig, ...inConfig }

        gsap.to(spanRef.current, config)
      },
      animateOut: () => {
        if (!spanRef.current) return

        gsap.killTweensOf(spanRef.current)

        const defaultConfig = {
          [scaleProperty]: 0,
          duration,
          ease,
        }

        const config =
          typeof outConfig === 'function'
            ? { ...defaultConfig, ...outConfig(defaultConfig) }
            : { ...defaultConfig, ...outConfig }

        gsap.to(spanRef.current, config)
      },
    }))

    return (
      <span
        ref={spanRef}
        className={classNames(styles.colorBar, className)}
        style={{
          transform: startFull ? `${scaleProperty}(100%)` : `${scaleProperty}(0%)`,
          transformOrigin: transformOriginValue,
        }}
      />
    )
  },
)

ColorBar.displayName = 'ColorBar'

export default ColorBar
