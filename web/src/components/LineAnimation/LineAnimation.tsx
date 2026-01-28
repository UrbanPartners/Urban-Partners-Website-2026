import { useRef, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import styles from './LineAnimation.module.scss'
import classNames from 'classnames'
import useInView from '@/hooks/use-in-view'

export const DURATION = 0.8
export const EASE = 'Power3.easeOut'

const DEFAULT_IN_CONFIG = {
  duration: DURATION,
  ease: EASE,
}

const DEFAULT_OUT_CONFIG = {
  duration: DURATION,
  ease: EASE,
}

export interface LineAnimationProps {
  className?: string
  position: 'left' | 'right' | 'top' | 'bottom'
  animateFrom: 'left' | 'right' | 'top' | 'bottom'
  longerDuration?: boolean
  size?: 'full' | 'tiny' | 'small'
  startFull?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inConfig?: Record<string, any> | ((defaultConfig: any) => Record<string, any>)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outConfig?: Record<string, any> | ((defaultConfig: any) => Record<string, any>)
  animateInView?: boolean
}

export interface LineAnimationRef {
  animateIn: () => void
  animateOut: () => void
  getElement: () => HTMLSpanElement | null
}

const LineAnimation = forwardRef<LineAnimationRef, LineAnimationProps>(
  (
    {
      className = '',
      position,
      animateFrom,
      startFull = false,
      inConfig = {},
      outConfig = {},
      size = 'full',
      animateInView = false,
      longerDuration = false,
    },
    ref,
  ) => {
    const lineRef = useRef<HTMLSpanElement | null>(null)
    const { isInView, setElementToObserve } = useInView()

    const animateIn = useCallback(() => {
      if (lineRef.current) {
        const isHorizontal = animateFrom === 'left' || animateFrom === 'right'
        const scaleProperty = isHorizontal ? 'scaleX' : 'scaleY'

        const baseConfig = {
          [scaleProperty]: 1,
          ...DEFAULT_IN_CONFIG,
        }

        if (longerDuration) {
          baseConfig.duration = baseConfig.duration * 1.5
        }

        const config =
          typeof inConfig === 'function' ? { ...baseConfig, ...inConfig(baseConfig) } : { ...baseConfig, ...inConfig }

        gsap.killTweensOf(lineRef.current)
        gsap.to(lineRef.current, config)
      }
    }, [animateFrom, inConfig, longerDuration])

    const animateOut = useCallback(() => {
      if (lineRef.current) {
        const isHorizontal = animateFrom === 'left' || animateFrom === 'right'
        const scaleProperty = isHorizontal ? 'scaleX' : 'scaleY'

        const baseConfig = {
          [scaleProperty]: 0,
          ...DEFAULT_OUT_CONFIG,
        }

        if (longerDuration) {
          baseConfig.duration = baseConfig.duration * 1.5
        }

        const config =
          typeof outConfig === 'function'
            ? { ...baseConfig, ...outConfig(baseConfig) }
            : { ...baseConfig, ...outConfig }

        gsap.killTweensOf(lineRef.current)
        gsap.to(lineRef.current, config)
      }
    }, [animateFrom, outConfig, longerDuration])

    useImperativeHandle(ref, () => ({
      animateIn,
      animateOut,
      getElement: () => lineRef.current,
    }))

    const getPositionClass = () => {
      return styles[`position${position.charAt(0).toUpperCase() + position.slice(1)}`]
    }

    const getDimensionClass = () => {
      const isHorizontal = animateFrom === 'left' || animateFrom === 'right'
      return isHorizontal ? styles.dimensionHorizontal : styles.dimensionVertical
    }

    const getOriginClass = () => {
      return styles[`origin${animateFrom.charAt(0).toUpperCase() + animateFrom.slice(1)}`]
    }

    const getInitialScaleClass = () => {
      const isHorizontal = animateFrom === 'left' || animateFrom === 'right'
      const scaleType = isHorizontal ? 'Horizontal' : 'Vertical'
      const scaleState = startFull ? 'Full' : 'Zero'
      return styles[`scale${scaleType}${scaleState}`]
    }

    useEffect(() => {
      if (!animateInView) return
      if (isInView) {
        animateIn()
      }
    }, [animateInView, isInView, animateIn])

    return (
      <span
        ref={_ref => {
          lineRef.current = _ref
          setElementToObserve(_ref)
        }}
        data-line
        data-line-size={size}
        className={classNames(
          styles.line,
          getPositionClass(),
          getDimensionClass(),
          getOriginClass(),
          getInitialScaleClass(),
          className,
        )}
      />
    )
  },
)

LineAnimation.displayName = 'LineAnimation'

export default LineAnimation
