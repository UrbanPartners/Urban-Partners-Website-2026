import { forwardRef } from 'react'

interface SvgProps {
  className?: string
}

const Plus = forwardRef<SVGSVGElement, SvgProps>(({ className }, ref) => {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 28 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.0612 15.4085H0.323242V13.5605H13.0612L12.9952 0.228516H15.1072L15.0412 13.5605H27.7792V15.4085H15.0412L15.1072 28.8065H12.9952L13.0612 15.4085Z"
        fill="currentColor"
      />
    </svg>
  )
})

export default Plus

Plus.displayName = 'Plus'
