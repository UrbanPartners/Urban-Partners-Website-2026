'use client'

import { useState } from 'react'
import classnames from 'classnames'
import styles from './CmsDebug.module.scss'
import useStore from '@/store'

interface CmsDebugProps {
  className?: string
}

const CmsDebug = ({ className }: CmsDebugProps) => {
  const [clickCount, setClickCount] = useState(0)
  const setCmsDebug = useStore(state => state.setCmsDebug)

  const handleClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)

    if (newCount >= 10) {
      setCmsDebug(true)
      setClickCount(0) // Reset count after activating
    }
  }

  return (
    <div
      className={classnames(styles.CmsDebug, className)}
      onClick={handleClick}
      onMouseLeave={() => {
        setClickCount(0)
      }}
    />
  )
}

CmsDebug.displayName = 'CmsDebug'

export default CmsDebug
