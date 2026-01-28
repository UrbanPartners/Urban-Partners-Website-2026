'use client'

import classnames from 'classnames'
import styles from './BlogPostHero.module.scss'
import { formatDateToDDMMYYYY } from '@/utils'
import useI18n from '@/hooks/use-i18n'
import LineAnimation, { LineAnimationRef } from '@/components/LineAnimation/LineAnimation'
import SplitText, { SplitTextRef } from '@/components/SplitTextComponent/SplitTextComponent'
import useInView from '@/hooks/use-in-view'
import { useEffect, useRef } from 'react'
import FadeIn from '@/components/FadeIn/FadeIn'
import useBreakpoint from '@/hooks/use-breakpoint'
import DownArrowAnimation from '@/components/DownArrowAnimation/DownArrowAnimation'

const BlogPostHero = ({ className, title, summary, author, date, readingTime, isCaseStudy }: SanityBlogPostHero) => {
  const { i18n } = useI18n()
  const { isInView, setElementToObserve } = useInView()
  const lineAnimationRef = useRef<(LineAnimationRef | null)[]>([])
  const titleAnimationRef = useRef<SplitTextRef | null>(null)
  const summaryAnimationRef = useRef<SplitTextRef | null>(null)
  const isLargeTitleStyling = title?.split(' ')?.length < 2
  const { isMobile } = useBreakpoint()

  const animateIn = () => {
    lineAnimationRef.current.forEach(ref => {
      if (ref) {
        ref.animateIn()
      }
    })

    if (titleAnimationRef.current) {
      titleAnimationRef.current.animateIn()
    }

    if (summaryAnimationRef.current) {
      summaryAnimationRef.current.animateIn()
    }
  }

  useEffect(() => {
    if (isInView) {
      animateIn()
    }
  }, [isInView])

  const caseStudyAuthorContent = (
    <>
      {isCaseStudy ? (
        <FadeIn animateInView>
          <p className={styles.caseStudyText}>{i18n('caseStudy')}</p>
        </FadeIn>
      ) : (
        <div className={styles.author}>
          {author && (
            <FadeIn
              element="p"
              className={styles.authorName}
              animateInView
            >
              {i18n('postedBy', {
                author: author.fullName,
              })}
            </FadeIn>
          )}
        </div>
      )}
    </>
  )

  if (!title) return null

  return (
    <div
      className={classnames(styles.BlogPostHero, className, {
        [styles.isLargeTitleStyling]: isLargeTitleStyling,
      })}
      ref={setElementToObserve}
    >
      <div className={styles.inner}>
        <div className={styles.top}>
          {date && (
            <FadeIn
              element="p"
              animateInView
              className={styles.date}
            >
              {date ? formatDateToDDMMYYYY(date) : ''}
            </FadeIn>
          )}
          <div className={styles.titleContainer}>
            <SplitText
              element="h1"
              ref={titleAnimationRef}
              className={styles.title}
              inConfig={defaultConfig => {
                return {
                  duration: defaultConfig.duration * 1.2,
                  stagger: defaultConfig.stagger * 1.2,
                }
              }}
            >
              {title}
            </SplitText>
          </div>
        </div>
        <div className={styles.bottom}>
          <LineAnimation
            position="top"
            animateFrom="left"
            className={styles.bottomLineAnimation}
            ref={ref => {
              lineAnimationRef.current[0] = ref
            }}
            inConfig={defaultConfig => {
              return {
                duration: defaultConfig.duration * 1.5,
                ease: 'Power3.easeInOut',
              }
            }}
          />
          <div className={styles.leftSide}>{!isMobile && caseStudyAuthorContent}</div>
          <div className={styles.rightSide}>
            <LineAnimation
              position="left"
              animateFrom="top"
              className={styles.rightSideLineAnimation}
              size="tiny"
              inConfig={defaultConfig => {
                return {
                  delay: defaultConfig.duration * 1.5 * 0.5,
                }
              }}
              ref={ref => {
                lineAnimationRef.current[1] = ref
              }}
            />
            {isMobile && caseStudyAuthorContent}
            <div className={styles.summary}>
              {summary && (
                <SplitText
                  ref={summaryAnimationRef}
                  className={styles.summaryText}
                >
                  {summary}
                </SplitText>
              )}
              {isMobile && (
                <DownArrowAnimation
                  animateInView
                  className={styles.downArrowAnimation}
                />
              )}
            </div>
            {typeof readingTime === 'number' && readingTime > 0 && (
              <FadeIn
                element="p"
                animateInView
                className={styles.readingTime}
              >
                {i18n('readingTime', { readingTimeMinutes: readingTime })}
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

BlogPostHero.displayName = 'BlogPostHero'

export default BlogPostHero
