'use client'

import classnames from 'classnames'
import styles from './OurStoryScroller.module.scss'
import IntroSection from './IntroSection/IntroSection'
import TimelineSection from './TimelineSection/TimelineSection'
import LocationsSection from './LocationsSection/LocationsSection'
import MediaSection from './MediaSection/MediaSection'
import { OurStoryScrollerProvider } from './OurStoryScrollerContext'

const OurStoryScroller = ({
  className,
  introSection,
  timelineSection,
  locationsSection,
  mediaSection,
}: SanityOurStoryScroller) => {
  return (
    <OurStoryScrollerProvider>
      <div className={classnames(styles.OurStoryScroller, className)}>
        <div className={styles.inner}>
          {introSection && <IntroSection {...introSection} />}
          {timelineSection && <TimelineSection {...timelineSection} />}
          {locationsSection && <LocationsSection {...locationsSection} />}
          {mediaSection && <MediaSection {...mediaSection} />}
        </div>
      </div>
    </OurStoryScrollerProvider>
  )
}

OurStoryScroller.displayName = 'OurStoryScroller'

export default OurStoryScroller
