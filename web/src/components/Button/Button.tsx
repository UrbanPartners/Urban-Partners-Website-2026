import classnames from 'classnames'
import styles from './Button.module.scss'
import React, { useImperativeHandle, useRef, useState } from 'react'
import Link from '@/components/Link/Link'
import useBreakpoint from '@/hooks/use-breakpoint'

const Button = React.forwardRef<ButtonImperativeHandle, ButtonProps>(
  (
    {
      className,
      label,
      children,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      isHoverState,
      onClick,
      element,
      link,
      linkClassName,
      disableHoverAnimation = false,
      ariaLabel,
      disableOpenNewTab,
      disabled,
      htmlFor,
      type,
    },
    ref,
  ) => {
    label = label || link?.label
    const [isHover, setIsHover] = useState(false)
    const containerRef = useRef<HTMLButtonElement | HTMLLabelElement | null>(null)
    const Element = link ? 'span' : element || 'button'
    const { isMobile } = useBreakpoint()

    useImperativeHandle(ref, () => ({
      getElement: () => {
        return containerRef.current
      },
      setIsHover: isHover => {
        setIsHover(isHover)
      },
    }))

    const handleOnMouseEnter = () => {
      if (onMouseEnter) onMouseEnter()
      if (!isMobile && !disableHoverAnimation) {
        setIsHover(true)
      }
    }

    const handleOnMouseLeave = () => {
      if (onMouseLeave) onMouseLeave()
      if (!isMobile && !disableHoverAnimation) {
        setIsHover(false)
      }
    }

    const handleOnClick = () => {
      if (onClick) onClick()
    }

    const handleOnFocus = () => {
      if (onFocus) onFocus()
    }

    const handleOnBlur = () => {
      if (onBlur) onBlur()
    }

    const content = (
      <Element
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={containerRef as any}
        className={classnames(styles.Button, className, { [styles.hover]: isHover || isHoverState })}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        onClick={handleOnClick}
        aria-label={ariaLabel}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        disabled={disabled}
        data-button
        htmlFor={htmlFor}
        data-button-type={type}
      >
        {label && !children && (
          <>
            <span
              className={styles.label}
              data-button-label
            >
              {label}
            </span>
          </>
        )}
        {children && children}
      </Element>
    )

    if (link) {
      return (
        <Link
          className={classnames(linkClassName, styles.link)}
          link={link}
          disableOpenNewTab={disableOpenNewTab}
        >
          {content}
        </Link>
      )
    }

    return content
  },
)

Button.displayName = 'Button'

export default Button
