import { forwardRef, useRef, useState, useImperativeHandle, useEffect, useMemo } from 'react'
import styles from './TextSwapper.module.scss'
import classNames from 'classnames'
import gsap from 'gsap'
import useBreakpoint from '@/hooks/use-breakpoint'
import useInView from '@/hooks/use-in-view'
import { DEFAULT_IN_CONFIG as SPLIT_TEXT_DEFAULT_IN_CONFIG } from '@/components/SplitTextComponent/SplitTextComponent'

const GSAP_CONFIG = {
  duration: SPLIT_TEXT_DEFAULT_IN_CONFIG.duration,
  ease: SPLIT_TEXT_DEFAULT_IN_CONFIG.ease,
}

const ANIMATING_OUT_DATASET = 'isAnimatingOut'
const ANIMATING_OUT_DATASET_VALUE = 'true'

const ANIMATION_STATE = {
  IDLE: 'idle',
  ANIMATED_OUT: 'animatingOut',
}

export interface TextSwapperProps {
  label?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  ariaLabel?: string
  onClick?: () => void
  theme?: 'light' | 'dark'
  id?: string
  className?: string
  showInitially?: boolean
  tabIndex?: number
  animateInView?: boolean
}

export interface TextSwapperRef {
  swapText: () => void
  reset: () => void
}

const TextSwapper = forwardRef<TextSwapperRef, TextSwapperProps>(
  (
    {
      label,
      ariaLabel,
      onClick,
      theme = 'light',
      id,
      className,
      showInitially = true,
      tabIndex,
      animateInView = false,
    },
    ref,
  ) => {
    const [indexes, setIndexes] = useState<number[]>([0])
    const indexesRef = useRef<number[]>([0])
    const innerRef = useRef<HTMLDivElement>(null)
    const animationStateRef = useRef(ANIMATION_STATE.IDLE)
    const resetDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const allowResetDebounceTimeoutRef = useRef(false)
    const [isHovering, setIsHovering] = useState(false)
    const [isCleanup, setIsCleanup] = useState(false)
    const { isMobile } = useBreakpoint()
    const { isInView, setElementToObserve } = useInView()
    const showInitiallyCalculated = useMemo(() => {
      if (animateInView || !showInitially) {
        return false
      }
      return true
    }, [animateInView, showInitially])

    const getElementByIndex = (index: number) => {
      if (!innerRef.current) return null
      return innerRef.current.querySelector(`[data-label-index="${index}"]`) as HTMLElement
    }

    const increaseIndexes = () => {
      setIndexes(prev => {
        const lastIndex = prev[prev.length - 1]
        const newIndexes = [...prev, lastIndex + 1]
        indexesRef.current = newIndexes
        return newIndexes
      })
    }

    const removePropsFromElements = (elements: (HTMLElement | null)[]) => {
      elements.forEach(element => {
        if (!element) return
        gsap.killTweensOf(element)
        gsap.set(element, {
          clearProps: true,
        })
      })
    }

    const reset = (removeProps = true) => {
      allowResetDebounceTimeoutRef.current = false
      setIndexes(prev => {
        const lastIndex = prev[prev.length - 1]
        const newIndexes = [lastIndex]
        indexesRef.current = newIndexes
        return newIndexes
      })

      const lastIndex = indexesRef.current[indexesRef.current.length - 1]
      const label = getElementByIndex(lastIndex)

      if (removeProps) {
        removePropsFromElements([label])
      } else {
        if (label) {
          gsap.set(label, {
            y: 0,
            autoAlpha: 1,
            opacity: 1,
          })
        }
      }

      if (label) {
        label.dataset[ANIMATING_OUT_DATASET] = 'false'
      }
    }

    const animations = {
      label: {
        in: (element: HTMLElement | null) => {
          animationStateRef.current = ANIMATION_STATE.IDLE
          if (!element) {
            return console.warn('No element exists in animateLabelIn')
          }
          gsap.killTweensOf(element)
          gsap.to(element, {
            duration: 0.0001,
            autoAlpha: 1,
            delay: 0.05,
          })
          gsap.fromTo(
            element,
            {
              y: '120%',
            },
            {
              ...GSAP_CONFIG,
              y: 0,
            },
          )
        },
        out: (element: HTMLElement | null, callback?: () => void) => {
          if (!element) {
            return console.warn('No element exists in animateLabelIn')
          }
          element.dataset[ANIMATING_OUT_DATASET] = ANIMATING_OUT_DATASET_VALUE
          gsap.killTweensOf(element)
          gsap.to(element, {
            ...GSAP_CONFIG,
            y: '-120%',
            onComplete: () => {
              if (callback) callback()
            },
          })
        },
      },
    }

    const animateOutOldIndexes = () => {
      const oldIndexes = indexesRef.current.filter((_, i) => {
        if (indexesRef.current.length === 1) return true
        return i !== indexesRef.current.length - 1
      })

      const elements: (HTMLElement | null)[] = []
      oldIndexes.forEach(index => {
        elements.push(getElementByIndex(index))
      })

      elements.forEach(label => {
        if (label?.dataset[ANIMATING_OUT_DATASET] !== ANIMATING_OUT_DATASET_VALUE) {
          animations.label.out(label)
        }
      })
    }

    const animateInNewIndex = () => {
      const newIndex = indexesRef.current[indexesRef.current.length - 1]
      const label = getElementByIndex(newIndex)

      animations.label.in(label)
    }

    const rotateText = () => {
      if (animationStateRef.current === ANIMATION_STATE.ANIMATED_OUT) return
      increaseIndexes()
      setTimeout(() => {
        animateInNewIndex()
        animateOutOldIndexes()
      }, 2)
    }

    const swapText = () => {
      if (isMobile) return
      allowResetDebounceTimeoutRef.current = true
      setIsHovering(true)
      rotateText()
    }

    const handleClick = () => {
      if (onClick) {
        onClick()
      }
    }

    const animateIn = () => {
      if (innerRef.current) {
        gsap.killTweensOf(innerRef.current)
        gsap.to(innerRef.current, {
          ...GSAP_CONFIG,
          y: 0,
        })
      }
    }

    useImperativeHandle(ref, () => ({
      reset: () => {
        reset()
      },
      animateIn,
      animateOut: () => {
        if (innerRef.current) {
          gsap.killTweensOf(innerRef.current)
          gsap.to(innerRef.current, {
            ...GSAP_CONFIG,
            y: '110%',
          })
        }
      },
      swapText: () => {
        swapText()
      },
    }))

    useEffect(() => {
      if (resetDebounceTimeoutRef.current) {
        clearTimeout(resetDebounceTimeoutRef.current)
      }

      if (indexes.length === 1 || isHovering) {
        return
      }

      if (!allowResetDebounceTimeoutRef.current) {
        return
      }

      resetDebounceTimeoutRef.current = setTimeout(
        () => {
          setIsCleanup(true)
          reset(false)
          setTimeout(() => {
            setIsCleanup(false)
          }, 10)
        },
        GSAP_CONFIG.duration * 1000 * 1.02,
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [indexes, isHovering])

    useEffect(() => {
      if (!animateInView) {
        return
      }

      if (animateInView && isInView) {
        animateIn()
      }
    }, [animateInView, isInView])

    return (
      <span
        className={classNames(
          styles.TextSwapper,
          className,
          { [styles[theme]]: theme },
          { [styles.isCleanup]: isCleanup },
        )}
        onClick={handleClick}
        aria-label={ariaLabel}
        id={id}
        data-show-initially={showInitiallyCalculated}
        {...(typeof tabIndex === 'number' ? { tabIndex } : {})}
        ref={setElementToObserve}
      >
        <span
          className={styles.inner}
          ref={innerRef}
        >
          <span
            className={styles.labelHidden}
            data-label-text
          >
            {label}
          </span>
          {indexes.map(index => {
            return (
              <span
                key={`${index}-label`}
                className={styles.label}
                data-label-index={index}
                data-label-text
              >
                {label && label}
              </span>
            )
          })}
        </span>
      </span>
    )
  },
)

TextSwapper.displayName = 'TextSwapper'

export default TextSwapper
