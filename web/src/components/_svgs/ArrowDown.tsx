import { forwardRef } from 'react'

interface SvgProps {
  className?: string
}

const ArrowDown = forwardRef<SVGSVGElement, SvgProps>(({ className }, ref) => {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2489_12)">
        <mask
          id="mask0_2489_12"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="24"
          height="24"
        >
          <path
            d="M24 0H0V24H24V0Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_2489_12)">
          <mask
            id="mask1_2489_12"
            maskUnits="userSpaceOnUse"
            x="4"
            y="2"
            width="16"
            height="20"
          >
            <path
              d="M20 22L20 2L4 2L4 22L20 22Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask1_2489_12)">
            <path
              d="M20 13.4058L11.9851 22L4 13.4377L5.1322 12.2236L11.1508 18.6774L11.1508 2L12.8194 2L12.8194 18.6774L18.838 12.1917L20 13.4058Z"
              fill="currentColor"
            />
          </g>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_2489_12">
          <rect
            width="24"
            height="24"
            fill="currentColor"
          />
        </clipPath>
      </defs>
    </svg>
  )
})

export default ArrowDown

ArrowDown.displayName = 'ArrowDown'
