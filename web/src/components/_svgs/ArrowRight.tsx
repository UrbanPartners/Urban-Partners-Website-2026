import { forwardRef } from 'react'

interface SvgProps {
  className?: string
}

const ArrowRight = forwardRef<SVGSVGElement, SvgProps>(({ className }, ref) => {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2561_16)">
        <g clipPath="url(#clip1_2561_16)">
          <path
            d="M13.4058 4L22 12.0149L13.4377 20L12.2236 18.8678L18.6774 12.8492H2V11.1806H18.6774L12.1917 5.16201L13.4058 4Z"
            fill="currentColor"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_2561_16">
          <rect
            width="24"
            height="24"
            fill="white"
          />
        </clipPath>
        <clipPath id="clip1_2561_16">
          <rect
            width="20"
            height="16"
            fill="white"
            transform="translate(2 4)"
          />
        </clipPath>
      </defs>
    </svg>
  )
})

export default ArrowRight

ArrowRight.displayName = 'ArrowRight'
