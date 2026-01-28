type LinkProps = {
  className?: string
  children?: ReactElement
  onMouseEnter?: MouseEvent<HTMLAnchorElement>
  onMouseLeave?: MouseEvent<HTMLAnchorElement>
  linkOnly?: boolean
  link: SanityLink
  ariaLabel?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  onFocus?: (e: MouseEvent<HTMLAnchorElement>) => void
  disableOpenNewTab?: boolean
  language?: string
  activeClass?: string
}
