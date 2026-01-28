import useWindowResize from '@/hooks/use-window-resize'
import { useEffect, useState } from 'react'

export const getIsReducedMotion = () => {
  if (typeof window === 'undefined') return false
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches === true
  return isReduced
}

const useIsReducedMotion = () => {
  const resizeKey = useWindowResize()
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    setIsReducedMotion(getIsReducedMotion())
  }, [resizeKey])

  return {
    isReducedMotion,
  }
}

useIsReducedMotion.displayName = 'useIsReducedMotion'

export default useIsReducedMotion
