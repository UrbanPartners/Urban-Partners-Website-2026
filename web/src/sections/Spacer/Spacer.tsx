'use client'

import styles from './Spacer.module.scss'

const Spacer = ({ hasLine, lineWidth }: SanitySpacer) => {
  if (!hasLine) {
    return null
  }

  return (
    <div
      className={styles.Spacer}
      data-spacer-line-width={lineWidth}
    >
      <div className={styles.inner}>
        <div className={styles.line} />
      </div>
    </div>
  )
}

Spacer.displayName = 'Spacer'

export default Spacer
