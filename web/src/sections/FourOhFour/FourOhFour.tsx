'use client'

import classnames from 'classnames'
import styles from './FourOhFour.module.scss'

const FourOhFour = ({ className }: SanityFourOhFour) => {
  return <div className={classnames(styles.FourOhFour, className)}>404</div>
}

FourOhFour.displayName = 'FourOhFour'

export default FourOhFour
