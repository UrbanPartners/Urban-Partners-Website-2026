'use client'

import React, { useState, useRef, useImperativeHandle, useEffect, useMemo } from 'react'
import classnames from 'classnames'
import styles from './TextAndIconButton.module.scss'
import ArrowButton, { ArrowButtonRef } from '@/components/ArrowButton/ArrowButton'
import Link from '@/components/Link/Link'
import { ICONS } from '@/components/Icon/Icon'
import useBreakpoint from '@/hooks/use-breakpoint'
import ColorBar, { ColorBarRef } from '@/components/ColorBar/ColorBar'
import TextSwapper, { TextSwapperRef } from '@/components/TextSwapper/TextSwapper'

export interface TextAndIconButtonProps {
  className?: string
  element?: 'button' | 'span'
  label?: string
  icon?: keyof typeof ICONS
  link?: SanityLink
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
  style?: 'short' | 'short-light-theme' | 'full' | 'full-line-left' | 'full-solid-button' | 'white-transparent-theme'
  disableOnHover?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export interface TextAndIconButtonRef {
  setIsHover: (hover: boolean) => void
  getElement: () => HTMLButtonElement | HTMLSpanElement | null
}

const TextAndIconButton = React.forwardRef<TextAndIconButtonRef, TextAndIconButtonProps>(
  (
    {
      className,
      element = 'button',
      label,
      icon = 'arrowRight',
      link,
      onClick,
      disabled,
      type = 'button',
      ariaLabel,
      style = 'short',
      disableOnHover = false,
      onMouseEnter,
      onMouseLeave,
    },
    ref,
  ) => {
    const [isHover, setIsHover] = useState(false)
    const containerRef = useRef<HTMLButtonElement | HTMLSpanElement | null>(null)
    const arrowButtonRef = useRef<ArrowButtonRef>(null)
    const arrowButtonColorBarRef = useRef<ColorBarRef>(null)
    const textColorBarRef = useRef<ColorBarRef>(null)
    const { isMobile } = useBreakpoint()
    const Element = link ? 'span' : element
    const textSwapperRef = useRef<TextSwapperRef>(null)
    const isFullButton = useMemo(() => {
      return (
        style === 'full' ||
        style === 'full-line-left' ||
        style === 'white-transparent-theme' ||
        style === 'full-solid-button'
      )
    }, [style])
    const colorBarTransformOrigin = useMemo(() => {
      return isFullButton ? 'bottom' : 'left'
    }, [isFullButton])

    useEffect(() => {
      if (disabled) {
        setIsHover(false)
      }
    }, [disabled])

    useEffect(() => {
      if (isHover) {
        textSwapperRef.current?.swapText()
        if (arrowButtonColorBarRef.current) {
          arrowButtonColorBarRef.current.animateIn()
        }
        if (textColorBarRef.current) {
          textColorBarRef.current.animateIn()
        }
      } else {
        if (arrowButtonColorBarRef.current) {
          arrowButtonColorBarRef.current.animateOut()
        }
        if (textColorBarRef.current) {
          textColorBarRef.current.animateOut()
        }
      }
    }, [isHover, isFullButton])

    useImperativeHandle(ref, () => ({
      setIsHover: (hover: boolean) => {
        setIsHover(hover)
        if (arrowButtonRef.current) {
          arrowButtonRef.current.setIsHover(hover)
        }
      },
      getElement: () => {
        return containerRef.current
      },
    }))

    const handleOnMouseEnter = () => {
      if (disableOnHover) return
      if (onMouseEnter) onMouseEnter()
      if (!isMobile) {
        setIsHover(true)
        if (arrowButtonRef.current) {
          arrowButtonRef.current.setIsHover(true)
        }
      }
    }

    const handleOnMouseLeave = () => {
      if (disableOnHover) return
      if (onMouseLeave) onMouseLeave()
      if (!isMobile) {
        setIsHover(false)
        if (arrowButtonRef.current) {
          arrowButtonRef.current.setIsHover(false)
        }
      }
    }

    const handleOnClick = () => {
      if (onClick) onClick()
    }

    const content = (
      <Element
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={containerRef as any}
        className={classnames(styles.TextAndIconButton, className, {
          [styles.isHover]: isHover,
        })}
        data-button-style={style}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        onClick={handleOnClick}
        disabled={disabled}
        type={element === 'button' && !link ? type : undefined}
        aria-label={ariaLabel}
        data-text-and-icon-button
      >
        <span
          className={styles.label}
          data-text-and-icon-button-label
        >
          <span className={styles.label__text}>
            <TextSwapper
              ref={textSwapperRef}
              label={label || link?.label || ''}
            />
            {/* {label || link?.label || ''} */}
          </span>
          {isFullButton && (
            <ColorBar
              className={styles.colorBarText}
              ref={textColorBarRef}
              transformOrigin={colorBarTransformOrigin}
              inConfig={{
                duration: 0.2,
                ease: 'none',
              }}
              outConfig={{
                duration: 0.15,
                delay: 0.05,
                ease: 'Power2.easeOut',
              }}
            />
          )}
        </span>
        <div className={styles.arrowButtonContainer}>
          <ColorBar
            className={styles.colorBar}
            ref={arrowButtonColorBarRef}
            transformOrigin={colorBarTransformOrigin}
            inConfig={{
              delay: 0.15,
              duration: 0.1,
              ease: 'Power1.easeOut',
            }}
            outConfig={{
              duration: 0.05,
              ease: 'none',
            }}
          />
          <ArrowButton
            ref={arrowButtonRef}
            iconName={icon}
            element="span"
            className={styles.arrowButton}
            disableOnHover
          />
        </div>
      </Element>
    )

    if (link) {
      return (
        <Link
          className={styles.link}
          link={link}
        >
          {content}
        </Link>
      )
    }

    return content
  },
)

TextAndIconButton.displayName = 'TextAndIconButton'

export default TextAndIconButton
