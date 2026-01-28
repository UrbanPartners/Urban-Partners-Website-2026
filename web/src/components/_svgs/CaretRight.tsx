import { forwardRef } from 'react'

interface SvgProps {
  className?: string
}

const CaretRight = forwardRef<SVGSVGElement, SvgProps>(({ className }, ref) => {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 20 20"
    >
      <path
        d="M14 10L6 18L12.5508 8.78947L12.5508 11.2105L6.72727 2L14 10Z"
        fill="currentColor"
      />
    </svg>
  )
})

CaretRight.displayName = 'CaretRight'

export default CaretRight
