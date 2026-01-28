'use client'

import classnames from 'classnames'
import styles from './SplitTextComponent.module.scss'
import { ReactNode, useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import useWindowResize from '@/hooks/use-window-resize'
import useInView from '@/hooks/use-in-view'
import useStore from '@/store'
import { deviceInfo } from '@/utils'

gsap.registerPlugin(SplitText)

export const DEFAULT_IN_CONFIG = {
  duration: 0.8,
  stagger: 0.065,
  ease: 'Power3.easeOut',
  y: 0,
}

export const DEFAULT_OUT_CONFIG = {
  duration: 0.8,
  ease: 'Power3.easeOut',
  y: '110%',
}

export type SplitTextComponentProps = {
  className?: string
  children: ReactNode
  type?: 'lines' | 'words' | 'chars'
  element?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  animateInView?: boolean
  revertOnAnimateIn?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inConfig?: Record<string, any> | ((defaultConfig: typeof DEFAULT_IN_CONFIG) => Record<string, any>)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outConfig?: Record<string, any> | ((defaultConfig: typeof DEFAULT_OUT_CONFIG) => Record<string, any>)
  debug?: boolean
  onInitialize?: () => void
  forceRendered?: boolean
}

export interface SplitTextRef {
  animateIn: () => void
  animateOut: () => void
  getElementsToAnimate: () => Element[]
}

const SplitTextComponent = forwardRef<SplitTextRef, SplitTextComponentProps>(
  (
    {
      className,
      children,
      type = 'lines',
      element = 'div',
      animateInView = false,
      revertOnAnimateIn = true,
      inConfig = {},
      outConfig = {},
      debug = false,
      onInitialize,
      forceRendered = false,
    },
    ref,
  ) => {
    const splitTextRef = useRef<SplitText | null>(null)
    const containerRef = useRef<HTMLElement | null>(null)
    const resizeKey = useWindowResize({ detectHeightChange: false, disableVisibilityChange: true })
    const [rendered, setRendered] = useState(forceRendered)
    const { isInView, setElementToObserve } = useInView()
    const maskRefs = useRef<Element[]>([])
    const lineRefs = useRef<Element[]>([])
    const wordRefs = useRef<Element[]>([])
    const charRefs = useRef<Element[]>([])
    const revertedOnAnimateIn = useRef(false)
    const fontsLoaded = useStore(state => state.fontsLoaded)
    const [queuedAnimation, setQueuedAnimation] = useState<'animateIn' | 'animateOut' | null>(null)
    const animateInTweenRef = useRef<GSAPAnimation | null>(null)
    const animateOutTweenRef = useRef<GSAPAnimation | null>(null)
    const [isCompletedAnimationIn, setIsCompletedAnimationIn] = useState(false)

    const revert = () => {
      if (splitTextRef.current) {
        splitTextRef.current.revert()
      }
    }

    const killTweens = () => {
      const elements = getElementsToAnimate()

      if (elements) {
        gsap.killTweensOf(elements)
      }

      if (animateInTweenRef.current) {
        animateInTweenRef.current.kill()
      }
      if (animateOutTweenRef.current) {
        animateOutTweenRef.current.kill()
      }
    }

    const getElementsToAnimate = () => {
      let elements: Element[] = []
      if (type === 'lines') {
        elements = lineRefs.current
      } else if (type === 'words') {
        elements = wordRefs.current
      } else if (type === 'chars') {
        elements = charRefs.current
      }
      return elements
    }

    const initialize = useCallback(() => {
      if (debug) {
        console.warn('Initialize', {
          type,
        })
      }
      if (!containerRef.current) return
      setRendered(false)
      revert()
      // let numChildren = 0
      // let inc = 0
      splitTextRef.current = SplitText.create(containerRef.current, {
        type,
        linesClass: styles.line,
        wordsClass: styles.word,
        charsClass: styles.char,
        mask: type,
        onSplit: e => {
          if (e.masks) {
            maskRefs.current = e.masks as Element[]
            maskRefs.current.forEach(el => el.setAttribute('data-split-text-type', 'mask'))
          }
          if (e.chars) {
            charRefs.current = e.chars as Element[]
            charRefs.current.forEach(el => el.setAttribute('data-split-text-type', 'char'))
          }
          if (e.words) {
            wordRefs.current = e.words as Element[]
            wordRefs.current.forEach(el => el.setAttribute('data-split-text-type', 'word'))
          }
          if (e.lines) {
            lineRefs.current = e.lines as Element[]
            lineRefs.current.forEach(el => el.setAttribute('data-split-text-type', 'line'))
          }
          setRendered(true)
        },
      })

      if (onInitialize) {
        onInitialize()
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type])

    const animateIn = useCallback(() => {
      if (debug) {
        console.warn('Animate In', {
          fontsLoaded,
        })
      }
      if (!fontsLoaded) {
        setQueuedAnimation('animateIn')
        return
      }

      if (!splitTextRef.current) return
      const elements = getElementsToAnimate()

      const config =
        typeof inConfig === 'function'
          ? { ...DEFAULT_IN_CONFIG, ...inConfig(DEFAULT_IN_CONFIG) }
          : { ...DEFAULT_IN_CONFIG, ...inConfig }

      killTweens()

      if (debug) {
        console.warn('Animate In, killing tweens', {
          elements,
        })
      }

      animateInTweenRef.current = gsap.to(elements, {
        ...config,
        onComplete: () => {
          // Need safari or shitty chrome mobile vs regular fix
          // Because they have jump on revert
          if (revertOnAnimateIn) {
            if (
              deviceInfo.browser.safari === true ||
              (deviceInfo.browser.chrome === true && deviceInfo.device.mobile === true)
            ) {
              setIsCompletedAnimationIn(true)
            } else {
              revertedOnAnimateIn.current = true
              revert()
            }
          }
        },
      })

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inConfig, revertOnAnimateIn, fontsLoaded, debug])

    const animateOut = useCallback(() => {
      if (debug) {
        console.warn('Animate Out', {
          fontsLoaded,
        })
      }

      if (!fontsLoaded) {
        setQueuedAnimation('animateOut')
        return
      }

      if (!splitTextRef.current) return

      const elements = getElementsToAnimate()

      const config =
        typeof outConfig === 'function'
          ? { ...DEFAULT_OUT_CONFIG, ...outConfig(DEFAULT_OUT_CONFIG) }
          : { ...DEFAULT_OUT_CONFIG, ...outConfig }

      killTweens()

      if (debug) {
        console.warn('Animate Out, killing tweens', {
          elements,
        })
      }

      animateOutTweenRef.current = gsap.to(elements, {
        ...config,
      })

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inConfig, fontsLoaded])

    useImperativeHandle(ref, () => ({
      animateIn,
      animateOut,
      getElementsToAnimate,
    }))

    useEffect(() => {
      if (!fontsLoaded) return
      if (revertedOnAnimateIn.current) return
      initialize()
    }, [resizeKey, fontsLoaded, initialize])

    useEffect(() => {
      // if (debug) {
      //   console.warn({ queuedAnimation, rendered, fontsLoaded })
      // }

      if (!queuedAnimation) return
      if (rendered) {
        if (queuedAnimation === 'animateIn') {
          animateIn()
        } else if (queuedAnimation === 'animateOut') {
          animateOut()
        }
        setQueuedAnimation(null)
      }
    }, [queuedAnimation, animateIn, animateOut, rendered, fontsLoaded])

    useEffect(() => {
      if (!animateInView || !rendered) return
      if (isInView) {
        animateIn()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animateInView, isInView, animateIn, rendered])

    const handleRef = (ref: HTMLElement | null) => {
      containerRef.current = ref
      setElementToObserve(ref)
    }

    const elementProps = {
      ref: handleRef,
      className: classnames(
        styles.SplitText,
        className,
        {
          [styles.rendered]: rendered,
        },
        {
          [styles.isCompletedAnimationIn]: isCompletedAnimationIn,
        },
      ),
      'data-split-text': true,
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

SplitTextComponent.displayName = 'SplitTextComponent'

export default SplitTextComponent
