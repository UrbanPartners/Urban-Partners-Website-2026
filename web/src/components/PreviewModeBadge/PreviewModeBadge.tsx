'use client'

import styles from './PreviewModeBadge.module.scss'

const PreviewModeBadge = ({
  isPreviewMode,
  hasSanityPreviewToken,
}: {
  isPreviewMode: boolean
  hasSanityPreviewToken: boolean
}) => {
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
