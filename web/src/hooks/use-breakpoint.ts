import { useLayoutEffect, useState } from 'react'

import styles from '@/styles/export-vars.module.scss'
import useWindowResize from '@/hooks/use-window-resize'
const { mobile, tablet, laptop, desktop, xl } = styles

const BREAKPOINTS = {
  mobile,
  tablet,
  laptop,
  desktop,
  xl,
}

type Breakpoint = {
  name: string
  width: number
}

export const getBreakpoint = (windowWidth?: number) => {
  let breakpoint = null

  if (!windowWidth) return breakpoint

  Object.values(BREAKPOINTS).forEach((bpValue, i) => {
    const bp = parseInt(bpValue)
    const beginningSize = i === 0 ? 0 : parseInt(Object.values(BREAKPOINTS)[i - 1])
    const endingSize = i === Object.values(BREAKPOINTS).length - 1 ? 10000 : bp

    if (windowWidth > beginningSize && windowWidth <= endingSize) {
      breakpoint = {
        name: Object.keys(BREAKPOINTS)[i],
        width: windowWidth,
      }
    }
  })

  return breakpoint as Breakpoint | null
}

export const getIsMobile = (windowWidth: number) => {
  const breakpoint = getBreakpoint(windowWidth)
  return breakpoint?.name === 'mobile' || breakpoint?.name === 'tablet'
}

function useBreakpoint() {
  const key = useWindowResize({ debounce: 100 })
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useLayoutEffect(() => {
    const bp = getBreakpoint(window.innerWidth)
    setBreakpoint(bp)
    setIsMobile(getIsMobile(window.innerWidth))
  }, [key])

  return {
    breakpoint,
    isMobile,
  }
}

export default useBreakpoint
