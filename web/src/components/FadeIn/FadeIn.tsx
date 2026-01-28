'use client'

import { useRef, forwardRef, useImperativeHandle, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import classnames from 'classnames'
import styles from './FadeIn.module.scss'
import useInView from '@/hooks/use-in-view'

const DEFAULT_IN_CONFIG = {
  duration: 0.8,
  ease: 'Power3.easeOut',
  autoAlpha: 1,
}

const DEFAULT_OUT_CONFIG = {
  duration: 0.8,
  ease: 'Power3.easeOut',
  autoAlpha: 0,
}

type FadeInProps = {
  className?: string
  children: React.ReactNode
  element?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  initialVisible?: boolean
  animateInView?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inConfig?: Record<string, any> | ((defaultConfig: typeof DEFAULT_IN_CONFIG) => Record<string, any>)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outConfig?: Record<string, any> | ((defaultConfig: typeof DEFAULT_OUT_CONFIG) => Record<string, any>)
}

export interface FadeInRef {
  animateIn: () => void
  animateOut: () => void
  getElement: () => HTMLElement | null
}

const FadeIn = forwardRef<FadeInRef, FadeInProps>(
  (
    {
      className,
      children,
      element = 'div',
      initialVisible = false,
      animateInView = false,
      inConfig = {},
      outConfig = {},
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLElement | null>(null)
    const { isInView, setElementToObserve } = useInView()

    const animateIn = useCallback(() => {
      if (!containerRef.current) return

      const baseConfig = {
        ...DEFAULT_IN_CONFIG,
      }

      const config =
        typeof inConfig === 'function' ? { ...baseConfig, ...inConfig(baseConfig) } : { ...baseConfig, ...inConfig }

      gsap.killTweensOf(containerRef.current)
      gsap.to(containerRef.current, config)
    }, [inConfig])

    const animateOut = useCallback(() => {
      if (!containerRef.current) return

      const baseConfig = {
        ...DEFAULT_OUT_CONFIG,
      }

      const config =
        typeof outConfig === 'function' ? { ...baseConfig, ...outConfig(baseConfig) } : { ...baseConfig, ...outConfig }

      gsap.killTweensOf(containerRef.current)
      gsap.to(containerRef.current, config)
    }, [outConfig])

    const getElement = useCallback(() => {
      return containerRef.current
    }, [])

    useImperativeHandle(ref, () => ({
      animateIn,
      animateOut,
      getElement,
    }))

    useEffect(() => {
      if (!animateInView) return
      if (isInView) {
        animateIn()
      }
    }, [animateInView, isInView, animateIn])

    const handleRef = useCallback(
      (ref: HTMLElement | null) => {
        containerRef.current = ref
        setElementToObserve(ref)
      },
      [setElementToObserve],
    )

    const elementProps = {
      ref: handleRef,
      className: classnames(styles.FadeIn, className, {
        [styles.initialVisible]: initialVisible,
      }),
      children,
    }

    switch (element) {
      case 'span':
        return <span {...elementProps} />
      case 'p':
        return <p {...elementProps} />
      case 'h1':
        return <h1 {...elementProps} />
      case 'h2':
        return <h2 {...elementProps} />
      case 'h3':
        return <h3 {...elementProps} />
      case 'h4':
        return <h4 {...elementProps} />
      case 'h5':
        return <h5 {...elementProps} />
      case 'h6':
        return <h6 {...elementProps} />
      default:
        return <div {...elementProps} />
    }
  },
)

FadeIn.displayName = 'FadeIn'

export default FadeIn
