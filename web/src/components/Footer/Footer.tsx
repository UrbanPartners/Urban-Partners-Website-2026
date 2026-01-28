'use client'

import Menu, { MenuRef } from '@/components/Menu/Menu'
import styles from './Footer.module.scss'
import { useEffect, useRef } from 'react'
import useInView from '@/hooks/use-in-view'
import CmsDebug from '@/components/CmsDebug/CmsDebug'
import useWindowResize from '@/hooks/use-window-resize'

const Footer = () => {
  const menuRef = useRef<MenuRef>(null)
  const { isInView, setElementToObserve } = useInView({ fireOnce: false })
  const resizeKey = useWindowResize()

  useEffect(() => {
    if (isInView) {
      menuRef.current?.animateIn()
    }
  }, [isInView, resizeKey])

  return (
    <footer
      className={styles.Footer}
      ref={ref => {
        setElementToObserve(ref)
      }}
    >
      <CmsDebug className={styles.cmsDebug} />
      <Menu ref={menuRef} />
    </footer>
  )
}

Footer.displayName = 'Footer'

export default Footer
