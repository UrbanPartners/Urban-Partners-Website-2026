'use client'

import { useEffect } from 'react'
import styles from './PreviewModeBadge.module.scss'

const PreviewModeBadge = ({
  isPreviewMode,
  hasSanityPreviewToken,
}: {
  isPreviewMode: boolean
  hasSanityPreviewToken: boolean
}) => {
  useEffect(() => {
    if (!hasSanityPreviewToken) return
    if (isPreviewMode) return

    const fire = async () => {
      try {
        await fetch('/api/enable-draft')
        window.location.reload()
      } catch (err) {
        // eslint-disable-next-line
        console.log({ err })
      }
    }

    fire()
  }, [isPreviewMode, hasSanityPreviewToken])

  if (!hasSanityPreviewToken || process.env.NODE_ENV === 'development') return null

  return (
    <div className={styles.PreviewModeBadge}>
      Preview Mode
      <span className={`${styles.dot} ${isPreviewMode ? styles.dotActive : ''}`} />
    </div>
  )
}

PreviewModeBadge.displayName = 'PreviewModeBadge'

export default PreviewModeBadge
