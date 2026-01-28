'use client'

import classnames from 'classnames'
import styles from './AuthorThumbnail.module.scss'
import SanityImage from '@/components/SanityImage/SanityImage'
import { SanityImage as SanityImageType } from '@/types/sanity/SanityImage'

type AuthorThumbnailProps = {
  image?: SanityImageType
  name: string
  designation?: string
  className?: string
}

const AuthorThumbnail = ({ image, name, designation, className }: AuthorThumbnailProps) => {
  return (
    <div className={classnames(styles.AuthorThumbnail, className)}>
      <div className={styles.authorImageContainer}>
        {image && (
          <SanityImage
            source={image}
            className={styles.authorImage}
            columns={2}
            aspectRatio={1}
          />
        )}
      </div>
      <div className={styles.authorName}>{name}</div>
      {designation && <div className={styles.authorDesignation}>{designation}</div>}
    </div>
  )
}

AuthorThumbnail.displayName = 'AuthorThumbnail'

export default AuthorThumbnail
