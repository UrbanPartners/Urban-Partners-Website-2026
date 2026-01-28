type ButtonImperativeHandle = {
  getElement: () => HTMLElement | null
  setIsHover: (isHover: boolean) => void
}

type ButtonProps = {
  className?: string
  label?: string
  children?: ReactElement
  onFocus?: MouseEvent<HTMLButtonElement | HTMLSpanElement>
  onBlur?: MouseEvent<HTMLButtonElement | HTMLSpanElement>
  onMouseEnter?: MouseEvent<HTMLButtonElement | HTMLSpanElement>
  onMouseLeave?: MouseEvent<HTMLButtonElement | HTMLSpanElement>
  onClick?: MouseEvent<HTMLButtonElement | HTMLSpanElement>
  isHoverState?: boolean
  element?: 'button' | 'span' | 'label'
  type?: 'rectangle' | 'circleIcon' | 'iconOnly'
  link?: SanityLink
  linkClassName?: string
  isLarge?: boolean
  isSmall?: boolean
  isFilled?: boolean
  isHighlightedColor?: boolean
  disableHoverAnimation?: boolean
  disabled?: boolean
  ariaLabel?: string
  disableOpenNewTab?: boolean
  htmlFor?: string
}
