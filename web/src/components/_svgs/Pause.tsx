import { forwardRef } from 'react'

interface SvgProps {
  className?: string
}

const Pause = forwardRef<SVGSVGElement, SvgProps>(({ className }, ref) => {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="2"
        width="5.33333"
        height="20"
        fill="currentColor"
      />
      <rect
        x="14.6667"
        y="2"
        width="5.33333"
        height="20"
        fill="currentColor"
      />
    </svg>
  )
})

export default Pause

Pause.displayName = 'Pause'
