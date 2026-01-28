'use client'

import { ReactNode, useRef } from 'react'
import { TransitionRouter } from 'next-transition-router'
import { SCROLL_CONTAINER_CLASS, SCROLL_CONTENT_CLASS } from '@/components/Layout/Layout'
import gsap from 'gsap'
import useStore from '@/store'
import { ALLOW_IS_IN_VIEW_DELAY_MS } from '@/data'

type PageTransitionProps = {
  children: ReactNode
}

const TRANSITION_DURATION = 0.5

const PageTransition = ({ children }: PageTransitionProps) => {
  const setCanInteract = useStore(state => state.setCanInteract)
  const setAllowIsInView = useStore(state => state.setAllowIsInView)
  const setNavIsOpen = useStore(state => state.setNavIsOpen)
  const setPageIsTransitioning = useStore(state => state.setPageIsTransitioning)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const getScrollContainer = () => {
    return document.querySelector(`.${SCROLL_CONTAINER_CLASS}`)
  }

  const getLayoutContainer = () => {
    return document.querySelector(`.${SCROLL_CONTENT_CLASS}`)
  }

  const scrollToTopHack = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      window.scrollTo(0, 0)
      const scrollContainer = getScrollContainer()
      if (scrollContainer) {
        scrollContainer.scrollTo(0, 0)
      }
    }, 20)

    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }, TRANSITION_DURATION * 1000)
  }

  const animateOut = async () => {
    const layoutContainer = getLayoutContainer()
    if (!layoutContainer) return
    setCanInteract(false)
    setAllowIsInView(false)
    setNavIsOpen(false)
    gsap.killTweensOf(layoutContainer)
    await gsap.to(layoutContainer, {
      opacity: 0,
      duration: TRANSITION_DURATION,
      ease: 'Power3.easeOut',
    })
  }

  const animateIn = async () => {
    const layoutContainer = getLayoutContainer()
    if (!layoutContainer) return
    setCanInteract(true)
    gsap.killTweensOf(layoutContainer)

    setTimeout(() => {
      setAllowIsInView(true)
    }, ALLOW_IS_IN_VIEW_DELAY_MS)

    await gsap.to(layoutContainer, {
      opacity: 1,
      duration: 0.001,
    })
  }

  return (
    <TransitionRouter
      leave={async next => {
        setPageIsTransitioning(true)
        await animateOut()
        next()
      }}
      enter={async next => {
        scrollToTopHack()
        await animateIn()
        setPageIsTransitioning(false)
        next()
      }}
    >
      {children}
    </TransitionRouter>
  )
}

PageTransition.displayName = 'PageTransition'

export default PageTransition
