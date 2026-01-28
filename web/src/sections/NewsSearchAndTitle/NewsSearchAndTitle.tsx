'use client'

import classnames from 'classnames'
import styles from './NewsSearchAndTitle.module.scss'
import NewsSearchBar from './NewsSearchBar'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'

const NewsSearchAndTitle = ({
  className,
  title,
  blogCategories,
  blogReferences,
  hideDropdowns,
}: SanityNewsSearchAndTitle) => {
  return (
    <div className={classnames(styles.NewsSearchAndTitle, className)}>
      <div className={styles.inner}>
        {title && (
          <div className={styles.titleContainer}>
            <SplitTextComponent
              animateInView
              type="words"
              inConfig={{
                stagger: 0.05,
              }}
            >
              <h2 className={styles.titleText}>{title}</h2>
            </SplitTextComponent>
          </div>
        )}
        <NewsSearchBar
          blogCategories={blogCategories}
          blogReferences={blogReferences}
          hideDropdowns={hideDropdowns}
        />
      </div>
    </div>
  )
}

NewsSearchAndTitle.displayName = 'NewsSearchAndTitle'

export default NewsSearchAndTitle
