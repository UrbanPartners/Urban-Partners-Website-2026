import classnames from 'classnames'
import styles from './TestComponent.module.scss'
import ArrowButton from '@/components/ArrowButton/ArrowButton'
import Media from '@/components/Media/Media'

const TestComponent = ({ className, title, description, media }: SanityTestComponent) => {
  return (
    <div className={classnames(styles.TestComponent, className)}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        <p>{description}</p>
        <ArrowButton iconName="arrowDiagonal" />
        {media && (
          <Media
            className={styles.media}
            {...media}
          />
        )}
      </div>
    </div>
  )
}

TestComponent.displayName = 'TestComponent'

export default TestComponent
