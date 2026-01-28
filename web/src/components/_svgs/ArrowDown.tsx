import { forwardRef } from 'react'

interface SvgProps {
  className?: string
}

const ArrowDown = forwardRef<SVGSVGElement, SvgProps>(({ className }, ref) => {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 50 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.902929 40.5733L2.79293 38.6833L23.7629 57.9433L23.7629 0.8833L26.6429 0.8833L26.6429 57.9433L47.6129 38.6833L49.5029 40.5733L25.2029 63.0733L0.902929 40.5733Z"
        fill="currentColor"
      />
    </svg>
  )
})

export default ArrowDown

ArrowDown.displayName = 'ArrowDown'
