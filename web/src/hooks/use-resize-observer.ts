import { useState, useEffect, useRef } from 'react'

export const USE_RESIZE_OBSERVER_DEFAULTS = {
  debounce: 100,
  debug: false,
}

type UseResizeObserverProps = {
  debounce?: number
  debug?: boolean
}

type Dimensions = {
  width: number
  height: number
}

export default function useResizeObserver(props?: UseResizeObserverProps) {
  const options: UseResizeObserverProps = { ...USE_RESIZE_OBSERVER_DEFAULTS, ...props }
  const [elementToObserve, setElementToObserve] = useState<HTMLElement | null>(null)
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 })
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (options.debug) {
      // eslint-disable-next-line no-console
      console.warn(`useResizeObserver: elementToObserve: ${elementToObserve}`)
    }

    if (!elementToObserve) {
      // Clean up if element is removed
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
      setDimensions({ width: 0, height: 0 })
      return
    }

    // Clean up existing observer
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect()
    }

    // Clear any pending debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Create new ResizeObserver
    resizeObserverRef.current = new ResizeObserver(entries => {
      const updateDimensions = () => {
        if (entries.length > 0) {
          const entry = entries[0]
          const { width, height } = entry.contentRect

          if (options.debug) {
            // eslint-disable-next-line no-console
            console.warn(`useResizeObserver: size changed - width: ${width}, height: ${height}`)
          }

          setDimensions({ width, height })
        }
      }

      if (options.debounce && options.debounce > 0) {
        // Debounce the update
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }
        debounceTimeoutRef.current = setTimeout(updateDimensions, options.debounce)
      } else {
        // Update immediately
        updateDimensions()
      }
    })

    // Observe the element
    resizeObserverRef.current.observe(elementToObserve)

    // Get initial dimensions
    const rect = elementToObserve.getBoundingClientRect()
    setDimensions({ width: rect.width, height: rect.height })

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
    }
  }, [elementToObserve, options.debounce, options.debug])

  return { setElementToObserve, dimensions }
}
