import { forwardRef } from 'react'

interface SvgProps {
  className?: string
}

const CaretDown = forwardRef<SVGSVGElement, SvgProps>(({ className }, ref) => {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2561_20)">
        <path
          d="M1.46936 7.53001L2.53002 6.46935L12 15.9393L21.47 6.46935L22.5306 7.53001L12 18.0607L1.46936 7.53001Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2561_20">
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

export default CaretDown

CaretDown.displayName = 'CaretDown'
