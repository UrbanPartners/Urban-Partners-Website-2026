'use client'

import Lenis from '@studio-freight/lenis'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import useWindowResize, { USE_WINDOW_RESIZE_DEFAULTS } from '@/hooks/use-window-resize'
import { SCROLL_CONTAINER_CLASS, SCROLL_CONTENT_CLASS } from '@/components/Layout/Layout'
import { usePathname } from 'next/navigation'
import useStore from '@/store'
import { deviceInfo } from '@/utils'

ScrollTrigger.config({
  ignoreMobileResize: true,
})

gsap.registerPlugin(ScrollTrigger)

gsap.config({ nullTargetWarn: false })

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type OnScrollCallbackArgs = { key: string; callback?: (scrollData: any) => void; remove?: boolean }

type ScrollContextType = {
  scroll: null | Lenis
  initScroll: () => void
  onScrollCallback: (args: OnScrollCallbackArgs) => void
}

export const ScrollContext = React.createContext({
  scroll: null,
  initScroll: () => {},
  onScrollCallback: () => {},
} as ScrollContextType)

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<Lenis | null>(null)
  const scrollRaf = useRef<number>(0)
  const [scrollInstance, setScrollInstance] = useState<Lenis | null>(null)
  const scrollInstanceRef = useRef<Lenis | null>(null)
  const resizeKey = useWindowResize({ debounce: USE_WINDOW_RESIZE_DEFAULTS.debounce + 75 })
  const pathname = usePathname()
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const heightChangeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navIsOpen = useStore(state => state.navIsOpen)
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const onScrollCallbacksRef = useRef<{ [key: string]: (scrollData: any) => void }>({})
  const [scrollContent, setScrollContent] = useState<HTMLDivElement | null>(null)
  const [queuedRefresh, setQueuedRefresh] = useState(false)
  const isCurrentScrollingRef = useRef(false)
  const [isCurrentlyScrolling, setIsCurrentlyScrolling] = useState(false)
  const isScrollingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onScrollCallback = useCallback(({ key, callback, remove }: OnScrollCallbackArgs) => {
    if (!key) return

    const callbacks = {
      ...onScrollCallbacksRef.current,
    }

    if (remove) {
      delete callbacks[key]
    } else {
      if (callback) {
        callbacks[key] = callback
      }
    }

    onScrollCallbacksRef.current = callbacks
  }, [])

  useEffect(() => {
    if (!scrollInstance) return
    scrollInstance[navIsOpen ? 'stop' : 'start']()
  }, [navIsOpen, scrollInstance])

  useEffect(() => {
    if (!scrollInstance) return
    scrollInstance.scrollTo(0, { immediate: true })
    scrollInstance?.resize()
  }, [pathname, scrollInstance])

  const initScroll = useCallback(() => {
    const scrollContainer = document.querySelectorAll(`.${SCROLL_CONTAINER_CLASS}`)[0]
    const scrollContent = document.querySelectorAll(`.${SCROLL_CONTENT_CLASS}`)[0]
    setScrollContent(scrollContent as HTMLDivElement)

    if (!scrollContainer || !scrollContent) return

    setScrollInstance(null)
    scrollInstanceRef.current = null

    if (scrollRaf.current) {
      cancelAnimationFrame(scrollRaf.current)
    }
    if (scrollRef.current) {
      scrollRef.current.destroy()
      scrollRef.current = null
    }

    const isMobileChrome = deviceInfo.device.type === 'mobile' && deviceInfo.browser.chrome
    const isDesktop = deviceInfo.device.desktop || isMobileChrome
    const isBodyScroller = isDesktop

    let wrapperOptions = {
      wrapper: window,
      content: document.documentElement,
    }

    if (!isBodyScroller) {
      wrapperOptions = {
        wrapper: scrollContainer,
        content: scrollContent,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    }

    document.body.dataset.isBodyScroller = `${isBodyScroller}`

    scrollRef.current = new Lenis({
      duration: 1.2,
      autoResize: false,
      ...wrapperOptions,
    })

    if (!isBodyScroller) {
      ScrollTrigger.defaults({
        scroller: scrollContainer,
      })
    }

    const isMobileDevice = deviceInfo.device.mobile === true

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    scrollRef.current.on('scroll', (scroll: any) => {
      ScrollTrigger.update()
      const animatedScrollDiff = Math.abs(scroll.animatedScroll - scroll.targetScroll)
      isCurrentScrollingRef.current = true
      setIsCurrentlyScrolling(true)

      const setIsNotScrolling = () => {
        isCurrentScrollingRef.current = false
        setIsCurrentlyScrolling(false)
      }

      if (animatedScrollDiff < 4 && !isMobileDevice) {
        setIsNotScrolling()
      }

      if (isScrollingTimeoutRef.current) {
        clearTimeout(isScrollingTimeoutRef.current)
      }

      isScrollingTimeoutRef.current = setTimeout(
        () => {
          setIsNotScrolling()
        },
        isMobileDevice ? 60 : 20,
      )

      Object.values(onScrollCallbacksRef.current).forEach(callback => {
        if (callback) {
          callback(scroll)
        }
      })
    })

    gsap.ticker.add(time => {
      if (scrollRef.current) {
        scrollRef.current.raf(time * 1000)
      }
    })

    gsap.ticker.lagSmoothing(0)

    setScrollInstance(scrollRef.current)
    scrollInstanceRef.current = scrollRef.current
  }, [])

  useEffect(() => {
    initScroll()
  }, [initScroll])

  useEffect(() => {
    if (!scrollInstance) return

    scrollInstance.resize()
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 20)
  }, [resizeKey, scrollInstance])

  const refreshScrollTrigger = useCallback(() => {
    ScrollTrigger.refresh()
    if (scrollInstanceRef.current) scrollInstanceRef.current.resize()
  }, [])

  useEffect(() => {
    if (!scrollContent) return

    if (resizeObserverRef.current) {
      resizeObserverRef.current.unobserve(scrollContent)
    }

    refreshScrollTrigger()

    // create an Observer instance
    resizeObserverRef.current = new ResizeObserver(() => {
      if (heightChangeTimeoutRef.current) {
        clearTimeout(heightChangeTimeoutRef.current)
      }

      heightChangeTimeoutRef.current = setTimeout(() => {
        if (isCurrentScrollingRef.current) {
          setQueuedRefresh(true)
          return
        }
        refreshScrollTrigger()
      }, 20)
    })

    // start observing a DOM node
    resizeObserverRef.current.observe(scrollContent)
  }, [scrollInstance, refreshScrollTrigger, scrollContent])

  useEffect(() => {
    if (isCurrentlyScrolling) {
      return
    }

    if (queuedRefresh) {
      refreshScrollTrigger()
      setQueuedRefresh(false)
    }
  }, [queuedRefresh, refreshScrollTrigger, isCurrentlyScrolling])

  // useEffect(() => {
  //   const handlePopstate = () => {
  //     setTimeout(() => {
  //       scrollInstance?.scrollTo(0, { immediate: true })
  //     }, 5)
  //   }

  //   window.removeEventListener('popstate', handlePopstate)
  //   window.addEventListener('popstate', handlePopstate)

  //   return () => {
  //     window.removeEventListener('popstate', handlePopstate)
  //   }
  // }, [scrollInstance])

  return (
    <ScrollContext.Provider
      value={{
        scroll: scrollInstance,
        initScroll,
        onScrollCallback,
      }}
    >
      {children}
    </ScrollContext.Provider>
  )
}
