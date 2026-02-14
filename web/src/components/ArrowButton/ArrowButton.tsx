import React, { useState, useEffect, useRef, useImperativeHandle } from 'react'
import classNames from 'classnames'
import { gsap } from 'gsap'
import Icon, { ICONS } from '@/components/Icon/Icon'
import styles from './ArrowButton.module.scss'

export interface ArrowButtonProps {
  iconName: keyof typeof ICONS
  className?: string
  hiddenIconClassName?: string
  shownIconClassName?: string
  element?: 'button' | 'span'
  onlyShowHiddenOnHover?: boolean
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  disableOnHover?: boolean
  type?: 'button' | 'submit' | 'reset'
  role?: string
  tabIndex?: number
  'aria-label'?: string
  'aria-describedby'?: string
  'data-testid'?: string
  style?: React.CSSProperties
}

export interface ArrowButtonRef {
  setIsHover: (hover: boolean) => void
  getElement: () => HTMLDivElement | null
}

const ArrowButton = React.forwardRef<ArrowButtonRef, ArrowButtonProps>(
  (
    {
      iconName,
      className,
      element = 'button',
      disableOnHover = false,
      onlyShowHiddenOnHover = false,
      hiddenIconClassName,
      shownIconClassName,
      ...props
    },
    ref,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Element = element as any
    const [isHover, setIsHover] = useState(false)
    const shownIconRef = useRef<SVGSVGElement>(null)
    const hiddenIconRef = useRef<SVGSVGElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      setIsHover,
      getElement: () => {
        return containerRef.current
      },
    }))

    useEffect(() => {
      const shownSvgElement = shownIconRef.current
      const hiddenSvgElement = hiddenIconRef.current

      if (!shownSvgElement || !hiddenSvgElement) return

      // Kill any existing tweens
      gsap.killTweensOf([shownSvgElement, hiddenSvgElement])

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shownConfig: any = {
        x: isHover ? '100%' : '0%',
        opacity: isHover ? 0 : 1,
        duration: 0.3,
        ease: 'Power2.easeOut',
      }

      if (iconName === 'arrowDiagonal') {
        shownConfig.y = isHover ? '-100%' : '0%'
      }

      if (iconName === 'download' || iconName === 'arrowDown') {
        delete shownConfig.x
        shownConfig.y = isHover ? '100%' : '0%'
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hiddenConfig: any = {
        x: isHover ? '0%' : '-100%',
        opacity: isHover ? 1 : 0,
        duration: 0.3,
        ease: 'Power2.easeOut',
      }

      if (iconName === 'arrowDiagonal') {
        hiddenConfig.y = isHover ? '0%' : '100%'
      }

      if (iconName === 'download' || iconName === 'arrowDown') {
        delete hiddenConfig.x
        hiddenConfig.y = isHover ? '0%' : '-100%'
      }

      gsap.to(shownSvgElement, shownConfig)
      gsap.to(hiddenSvgElement, hiddenConfig)
    }, [isHover, iconName])

    return (
      <Element
        ref={containerRef}
        className={classNames(
          styles.arrowButton,
          {
            [styles.onlyShowHiddenOnHover]: onlyShowHiddenOnHover,
          },
          className,
        )}
        onMouseEnter={!disableOnHover ? () => setIsHover(true) : undefined}
        onMouseLeave={!disableOnHover ? () => setIsHover(false) : undefined}
        data-icon-name={iconName}
        data-arrow-button={true}
        {...props}
      >
        <Icon
          ref={shownIconRef}
          name={iconName}
          className={classNames(styles.icon, styles.shown, shownIconClassName)}
        />
        <Icon
          ref={hiddenIconRef}
          name={iconName}
          className={classNames(styles.icon, styles.hidden, hiddenIconClassName)}
        />
      </Element>
    )
  },
)

ArrowButton.displayName = 'ArrowButton'

export default ArrowButton
