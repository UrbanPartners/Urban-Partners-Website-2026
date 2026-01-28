'use client'

import { ScrollProvider } from '@/context/Scroll'
import { useEffect, useRef } from 'react'
import styles from './Layout.module.scss'
import useStore from '@/store'
import { deviceInfo } from '@/utils'
import Navigation from '@/components/Navigation/Navigation'
import { useParams, usePathname } from 'next/navigation'
import PreviewButton from '@/components/PreviewButton/PreviewButton'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

import Preloader from '@/components/Preloader/Preloader'
import useBreakpoint from '@/hooks/use-breakpoint'

ScrollTrigger.config({
  ignoreMobileResize: true,
})

gsap.registerPlugin(ScrollTrigger)

export const SCROLL_CONTAINER_CLASS = styles.scrollContainer
export const SCROLL_CONTENT_CLASS = styles.scrollContainerInner

const Layout = ({ children }: SanityLayout) => {
  const canInteract = useStore(state => state.canInteract)
  const params = useParams()
  const setFontsLoaded = useStore(state => state.setFontsLoaded)
  const pathname = usePathname()
  const previousPathname = useRef<string | null>(null)
  const updatePageHistory = useStore(state => state.updatePageHistory)
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true)
    })
  }, [setFontsLoaded])

  useEffect(() => {
    if (previousPathname.current === pathname) return
    previousPathname.current = pathname
    updatePageHistory(pathname)
  }, [pathname, updatePageHistory])

  // Set high-level body & document attributes
  useEffect(() => {
    // Device Info
    document.body.dataset.browser = deviceInfo.browser.name
    document.body.dataset.device = deviceInfo.device.type
    document.body.dataset.os = deviceInfo.os.name

    // Language
    document.documentElement.lang = params.language as string

    // Can interact
    document.body.dataset.enableInteraction = `${canInteract}`
  }, [params.language, canInteract])

  return (
    <ScrollProvider>
      {!isMobile && <Navigation />}
      <PreviewButton />
      <Preloader />
      <main className={SCROLL_CONTAINER_CLASS}>
        {isMobile && <Navigation />}
        <div className={SCROLL_CONTENT_CLASS}>{children}</div>
      </main>
    </ScrollProvider>
  )
}

Layout.displayName = 'Layout'

export default Layout
