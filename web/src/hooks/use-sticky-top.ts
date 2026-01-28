import useInView from '@/hooks/use-in-view'
import useStore from '@/store'
import { useEffect, useState } from 'react'
import styles from './use-sticky-top.module.scss'

const STICKY_TOP_CLASS = styles.stickyTop
const STICKY_TOP_CLASS_ACTIVE = styles.active

export default function useStickyTop({ scrolltriggerEnd = 'bottom top' }: { scrolltriggerEnd?: string } = {}) {
  const [stickyElement, setStickyElement] = useState<HTMLElement | null>(null)
  const [stickyElementParent, setStickyElementParent] = useState<HTMLElement | null>(null)
  const navState = useStore(state => state.navState)
  const { setElementToObserve, isInView } = useInView({
    fireOnce: false,
    scrolltriggerStart: 'top top',
    scrolltriggerEnd,
  })

  useEffect(() => {
    if (stickyElementParent) {
      setElementToObserve(stickyElementParent)
    }
  }, [stickyElementParent, setElementToObserve])

  useEffect(() => {
    if (stickyElement) {
      stickyElement.classList.add(STICKY_TOP_CLASS)
    }
  }, [stickyElement])

  useEffect(() => {
    if (!stickyElement) return
    if (isInView && navState === 'VISIBLE_ON_SCROLL') {
      stickyElement.classList.add(STICKY_TOP_CLASS_ACTIVE)
    } else {
      stickyElement.classList.remove(STICKY_TOP_CLASS_ACTIVE)
    }
  }, [isInView, stickyElement, navState])

  return {
    setStickyElement,
    setStickyElementParent,
  }
}
