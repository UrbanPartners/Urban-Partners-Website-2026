import classnames from 'classnames'
import styles from './PreviewButton.module.scss'
import { useContext, useEffect, useRef, useState } from 'react'
import { GlobalSettingsContext } from '@/context/GlobalSettings'

const PreviewButton = () => {
  const { isPreviewMode, hasSanityPreviewToken } = useContext(GlobalSettingsContext)
  const [closed, setClosed] = useState(false)
  const fetchingPreview = useRef(false)

  useEffect(() => {
    if (isPreviewMode || fetchingPreview.current || !hasSanityPreviewToken) return

    fetchingPreview.current = true

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

  if (closed || !hasSanityPreviewToken || process.env.NODE_ENV === 'development') return null

  return (
    <div className={classnames(styles.PreviewButton, { [styles.isPreview]: isPreviewMode })}>
      <span className={styles.text}>
        Preview Mode <span className={styles.dot} />
      </span>

      <button
        className={styles.closeButton}
        onClick={() => {
          setClosed(true)
        }}
      >
        Close
      </button>
    </div>
  )
}

PreviewButton.displayName = 'PreviewButton'

export default PreviewButton
