import { useState, useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import gsap from 'gsap'
import useWindowResize from '@/hooks/use-window-resize'
import useStore from '@/store'

ScrollTrigger.config({
  ignoreMobileResize: true,
})

gsap.registerPlugin(ScrollTrigger)

export const USE_IN_VIEW_DEFAULTS = {
  fireOnce: true,
  scrolltriggerStart: 'top bottom',
  scrolltriggerEnd: 'bottom top',
  debug: false,
}

type UseInViewProps = {
  fireOnce?: boolean
  scrolltriggerStart?: string
  scrolltriggerEnd?: string
  debug?: boolean
}

export default function useInView(props?: UseInViewProps) {
  const options: UseInViewProps = { ...USE_IN_VIEW_DEFAULTS, ...props }
  const [elementToObserve, setElementToObserve] = useState<HTMLElement | null>(null)
  const [isInView, setIsInView] = useState(false)
  const hasFiredInView = useRef(false)
  const scrollTriggerRef = useRef<ScrollTrigger>()
  const resizeKey = useWindowResize()
  const allowIsInView = useStore(store => store.allowIsInView)
  const [onEnterKey, setOnEnterKey] = useState<number | null>(null)
  const [onEnterBackKey, setOnEnterBackKey] = useState<number | null>(null)
  const [onLeaveKey, setOnLeaveKey] = useState<number | null>(null)
  const [onLeaveBackKey, setOnLeaveBackKey] = useState<number | null>(null)

  useEffect(() => {
    if (!allowIsInView) return
    if (options.debug) {
      // eslint-disable-next-line no-console
      console.warn(`useInView: elementToObserve: ${elementToObserve}`)
    }

    if (!elementToObserve || (hasFiredInView.current && options.fireOnce)) return

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
    }

    scrollTriggerRef.current = new ScrollTrigger({
      trigger: elementToObserve,
      start: options.scrolltriggerStart,
      end: options.scrolltriggerEnd,
      onEnter: () => {
        setIsInView(true)
        setOnEnterKey(new Date().getTime())

        if (options.debug) {
          // eslint-disable-next-line no-console
          console.warn('useInView: onEnter:', elementToObserve)
        }

        if (options.fireOnce && scrollTriggerRef.current) {
          scrollTriggerRef.current.kill()
        }
      },
      onEnterBack: () => {
        setIsInView(true)
        setOnEnterBackKey(new Date().getTime())

        if (options.debug) {
          // eslint-disable-next-line no-console
          console.warn('useInView: onEnterBack:', elementToObserve)
        }

        if (options.fireOnce && scrollTriggerRef.current) {
          scrollTriggerRef.current.kill()
        }
      },
      onLeave: () => {
        if (options.debug) {
          // eslint-disable-next-line no-console
          console.warn('useInView: onLeave:', elementToObserve)
        }

        if (!options.fireOnce) {
          setIsInView(false)
          setOnLeaveKey(new Date().getTime())
        }
      },
      onLeaveBack: () => {
        if (options.debug) {
          // eslint-disable-next-line no-console
          console.warn('useInView: onLeaveBack:', elementToObserve)
        }

        if (!options.fireOnce) {
          setIsInView(false)
          setOnLeaveBackKey(new Date().getTime())
        }
      },
    })
  }, [
    elementToObserve,
    options.fireOnce,
    options.scrolltriggerStart,
    options.scrolltriggerEnd,
    resizeKey,
    options.debug,
    allowIsInView,
  ])

  useEffect(() => {
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }
    }
  }, [])

  return { setElementToObserve, isInView, setIsInView, onEnterKey, onEnterBackKey, onLeaveKey, onLeaveBackKey }
}
