'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import styles from './PeopleAccordionPerson.module.scss'
import SanityImage from '@/components/SanityImage/SanityImage'
import MaskReveal, { MaskRevealRef } from '@/components/MaskReveal/MaskReveal'
import SplitTextComponent, { SplitTextRef } from '@/components/SplitTextComponent/SplitTextComponent'
import FadeIn, { FadeInRef } from '@/components/FadeIn/FadeIn'
import { SanityImage as SanityImageType } from '@/types/sanity/SanityImage'
import Link from '@/components/Link/Link'
import ArrowButton, { ArrowButtonRef } from '@/components/ArrowButton/ArrowButton'
import LineAnimation, { LineAnimationRef } from '@/components/LineAnimation/LineAnimation'
import useBreakpoint from '@/hooks/use-breakpoint'
import classNames from 'classnames'

export interface PeopleAccordionPersonRef {
  animateIn: () => void
  animateOut: () => void
}

interface PeopleAccordionPersonProps {
  person: SanityPerson
}

const PeopleAccordionPerson = forwardRef<PeopleAccordionPersonRef, PeopleAccordionPersonProps>(({ person }, ref) => {
  const maskRevealRef = useRef<MaskRevealRef>(null)
  const splitTextRefDesktop = useRef<SplitTextRef>(null)
  const splitTextRefMobile = useRef<SplitTextRef>(null)
  const fadeInRef = useRef<FadeInRef>(null)
  const arrowButtonRef = useRef<ArrowButtonRef>(null)
  const lineAnimationTopRef = useRef<LineAnimationRef>(null)
  const lineAnimationMiddleRef = useRef<LineAnimationRef>(null)
  const link = person.linkedInUrl
  const { isMobile } = useBreakpoint()

  const animateIn = () => {
    if (maskRevealRef.current) {
      maskRevealRef.current.animateIn()
    }
    if (splitTextRefMobile.current) {
      splitTextRefMobile.current.animateIn()
    }
    if (splitTextRefDesktop.current) {
      splitTextRefDesktop.current.animateIn()
    }
    if (fadeInRef.current) {
      fadeInRef.current.animateIn()
    }

    if (lineAnimationTopRef.current) {
      lineAnimationTopRef.current.animateIn()
    }

    if (lineAnimationMiddleRef.current) {
      lineAnimationMiddleRef.current.animateIn()
    }
  }

  const animateOut = () => {
    if (maskRevealRef.current) {
      maskRevealRef.current.animateOut()
    }
    if (splitTextRefMobile.current) {
      splitTextRefMobile.current.animateOut()
    }
    if (splitTextRefDesktop.current) {
      splitTextRefDesktop.current.animateOut()
    }
    if (fadeInRef.current) {
      fadeInRef.current.animateOut()
    }
    if (lineAnimationTopRef.current) {
      lineAnimationTopRef.current.animateOut()
    }
    if (lineAnimationMiddleRef.current) {
      lineAnimationMiddleRef.current.animateOut()
    }
  }

  useImperativeHandle(ref, () => ({
    animateIn,
    animateOut,
  }))

  useEffect(() => {
    setTimeout(() => {
      animateOut()
    }, 100)
  }, [])

  const titleContentProps = {
    inConfig: {
      delay: 0.6,
    },
    revertOnAnimateIn: false,
  }

  const titleTextClassName = styles.titleText
  const titleClassName = styles.title

  const titleContentMobile = (
    <SplitTextComponent
      ref={splitTextRefMobile}
      className={classNames(titleClassName, styles.titleMobile)}
      {...titleContentProps}
    >
      <p className={titleTextClassName}>{person.firstName}</p>
      <p className={titleTextClassName}>{person.lastName}</p>
    </SplitTextComponent>
  )

  const titleContentDesktop = (
    <SplitTextComponent
      ref={splitTextRefDesktop}
      className={classNames(titleClassName, styles.titleDesktop)}
      {...titleContentProps}
    >
      <p className={titleTextClassName}>{person.fullName}</p>
    </SplitTextComponent>
  )

  let titleContent = null

  if (isMobile === null) {
    return null
  }

  if (link) {
    titleContent = (
      <Link
        link={{
          linkType: 'external',
          link: link,
        }}
        className={styles.titleContainer}
        onMouseEnter={() => {
          if (arrowButtonRef.current) {
            arrowButtonRef.current.setIsHover(true)
          }
        }}
        onMouseLeave={() => {
          if (arrowButtonRef.current) {
            arrowButtonRef.current.setIsHover(false)
          }
        }}
      >
        {titleContentMobile}
        {titleContentDesktop}
        <ArrowButton
          ref={arrowButtonRef}
          disableOnHover
          iconName="arrowDiagonal"
          className={styles.arrowButton}
          element="span"
        />
      </Link>
    )
  } else {
    titleContent = (
      <div className={styles.titleContainer}>
        {titleContentMobile}
        {titleContentDesktop}
      </div>
    )
  }

  return (
    <div className={styles.PeopleAccordionPerson}>
      <LineAnimation
        position="top"
        animateFrom="left"
        longerDuration
        ref={lineAnimationTopRef}
        className={styles.lineAnimationTop}
      />
      <LineAnimation
        position="left"
        animateFrom="top"
        longerDuration
        ref={lineAnimationMiddleRef}
        className={styles.lineAnimationMiddle}
        size="tiny"
      />
      {person.image && (
        <MaskReveal
          ref={maskRevealRef}
          direction="FROM_TOP"
          className={styles.imageContainer}
          outConfig={{
            duration: 0.4,
          }}
          inConfig={{
            delay: 0.4,
          }}
        >
          <SanityImage
            source={person.image as SanityImageType}
            aspectRatio={336 / 448}
            className={styles.image}
            columns={{
              tablet: 2,
              xs: 6,
            }}
          />
        </MaskReveal>
      )}
      <div className={styles.textContent}>
        {titleContent}
        {person.email && (
          <Link
            link={{
              linkType: 'external',
              link: `mailto:${person.email}`,
            }}
            className={styles.emailLink}
          >
            <FadeIn
              ref={fadeInRef}
              className={styles.email}
              inConfig={{
                delay: 0.7,
              }}
            >
              <p className={styles.emailText}>{person.email}</p>
            </FadeIn>
          </Link>
        )}
      </div>
    </div>
  )
})

PeopleAccordionPerson.displayName = 'PeopleAccordionPerson'

export default PeopleAccordionPerson
