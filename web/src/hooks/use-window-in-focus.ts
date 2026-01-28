import { useEffect, useState } from 'react'

export const USE_WINDOW_RESIZE_DEFAULTS = {
  debounce: 100,
}

type UseWindowInFocusProps = {
  debounce?: number | undefined
}

export default function useWindowInFocus(props?: UseWindowInFocusProps) {
  const options: UseWindowInFocusProps = { ...USE_WINDOW_RESIZE_DEFAULTS, ...props }
  const [key, setKey] = useState<number>(0)

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null

    function handleVisibilityChange() {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }

      resizeTimeout = setTimeout(() => {
        setKey(Date.now())
      }, options.debounce)
    }

    window.removeEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [options.debounce])

  return key
}
