import { forwardRef } from 'react'

interface SvgProps {
  className?: string
}

const ArrowDiagonal = forwardRef<SVGSVGElement, SvgProps>(({ className }, ref) => {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2561_9)">
        <path
          d="M21.5687 16.2353L18.6567 16.1979V6.97661L4.32072 21.3873L2.19271 19.2219L16.6034 4.84861H7.34472V1.97396H21.5687V16.2353Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2561_9">
          <rect
            width="24"
            height="24"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  )
})

export default ArrowDiagonal

ArrowDiagonal.displayName = 'ArrowDiagonal'
