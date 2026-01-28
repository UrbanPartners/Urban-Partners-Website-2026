import { deviceInfo } from '@/utils'
import { useEffect, useState } from 'react'

export const USE_WINDOW_RESIZE_DEFAULTS = {
  debounce: 300,
  detectHeightChange: false,
  disableVisibilityChange: false,
}

type UseWindowResizeProps = {
  debounce?: number | undefined
  detectHeightChange?: boolean
  disableVisibilityChange?: boolean
}

export default function useWindowResize(props?: UseWindowResizeProps) {
  const options: UseWindowResizeProps = { ...USE_WINDOW_RESIZE_DEFAULTS, ...props }
  const [previousWidth, setPreviousWidth] = useState<number | null>(null)
  const [previousHeight, setPreviousHeight] = useState<number | null>(null)
  const [key, setKey] = useState<number>(0)

  useEffect(() => {
    const isMobile = deviceInfo.device.type === 'mobile'

    if (previousWidth === null) {
      setPreviousWidth(window.innerWidth)
      return
    }

    if (previousHeight === null && options.detectHeightChange && !isMobile) {
      setPreviousHeight(window.innerHeight)
      return
    }

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null

    function handleResize() {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }

      resizeTimeout = setTimeout(() => {
        if (window.innerWidth !== previousWidth) {
          setPreviousWidth(window.innerWidth)

          setKey(Date.now())
        }

        if (window.innerHeight !== previousHeight && !isMobile) {
          setPreviousHeight(window.innerHeight)

          setKey(Date.now())
        }
      }, options.debounce)
    }

    window.removeEventListener('resize', handleResize)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [previousWidth, previousHeight, options.debounce, options.detectHeightChange])

  useEffect(() => {
    const handleVisibilityChange = () => {
      setTimeout(() => {
        setKey(Date.now())
      }, 50)
    }

    window.removeEventListener('visibilitychange', handleVisibilityChange)

    if (options.disableVisibilityChange) return

    window.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [options.disableVisibilityChange])

  return key
}
