'use client'

import { useRef } from 'react'
import classnames from 'classnames'
import styles from './NewsCardHorizontal.module.scss'
import Link from '@/components/Link/Link'
import TextAndIconButton, { TextAndIconButtonRef } from '@/components/TextAndIconButton/TextAndIconButton'
import { DOC_TYPES } from '@/data'
import useI18n from '@/hooks/use-i18n'
import { formatDateToDDMMYYYY } from '@/utils'

interface NewsCardHorizontalProps {
  title: string
  slug: string
  publishedDate?: string
  className?: string
}

const NewsCardHorizontal = ({ className, title, slug, publishedDate }: NewsCardHorizontalProps) => {
  const textAndIconButtonRef = useRef<TextAndIconButtonRef>(null)
  const { i18n } = useI18n()

  const handleMouseEnter = () => {
    if (textAndIconButtonRef.current) {
      textAndIconButtonRef.current.setIsHover(true)
    }
  }

  const handleMouseLeave = () => {
    if (textAndIconButtonRef.current) {
      textAndIconButtonRef.current.setIsHover(false)
    }
  }

  return (
    <Link
      className={classnames(styles.NewsCardHorizontal, className)}
      link={{
        linkType: 'internal',
        link: {
          _type: DOC_TYPES.BLOG_POST,
          slug,
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.top}>
        {title && <h3 className={styles.title}>{title}</h3>}
        {publishedDate && <p className={styles.publishedDate}>{formatDateToDDMMYYYY(publishedDate)}</p>}
      </div>
      <div className={styles.bottom}>
        <TextAndIconButton
          ref={textAndIconButtonRef}
          style="full"
          element="span"
          disableOnHover
          label={i18n('readArticle')}
        />
      </div>
    </Link>
  )
}

NewsCardHorizontal.displayName = 'NewsCardHorizontal'

export default NewsCardHorizontal
