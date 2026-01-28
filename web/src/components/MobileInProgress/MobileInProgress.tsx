'use client'

import { useContext } from 'react'
import styles from './MobileInProgress.module.scss'
import { GlobalSettingsContext } from '@/context/GlobalSettings'

const MobileInProgress = () => {
  const { hasSanityPreviewToken } = useContext(GlobalSettingsContext)

  if (process.env.NODE_ENV === 'development' || hasSanityPreviewToken) return null

  return (
    <div className={styles.MobileInProgress}>
      <div className={styles.inner}>Mobile development in progress.</div>
    </div>
  )
}

MobileInProgress.displayName = 'MobileInProgress'

export default MobileInProgress
