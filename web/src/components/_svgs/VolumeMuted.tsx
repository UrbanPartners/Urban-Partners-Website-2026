import { forwardRef } from 'react'

interface SvgProps {
  className?: string
}

const VolumeMuted = forwardRef<SVGSVGElement, SvgProps>(({ className }, ref) => {
  return (
    <svg
      className={className}
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.01405 17.0594H6.70726L13.9906 22V2L6.70726 6.94062H4.01405C3.45199 6.94062 2.9758 7.13856 2.58548 7.53444C2.19516 7.93033 2 8.40538 2 8.95962V15.0404C2 15.5946 2.19516 16.0697 2.58548 16.4656C2.9758 16.8614 3.45199 17.0594 4.01405 17.0594Z"
        fill="currentColor"
      />
      <path
        d="M22.0608 13.9395L21.0002 15.0002L16 10L17.0607 8.93934L22.0608 13.9395Z"
        fill="currentColor"
      />
      <path
        d="M20.9324 8.93918L21.9931 9.99984L16.9929 15L15.9323 13.9393L20.9324 8.93918Z"
        fill="currentColor"
      />
    </svg>
  )
})

export default VolumeMuted

VolumeMuted.displayName = 'VolumeMuted'
