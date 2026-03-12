'use client'

import { useState, useEffect, useRef, useContext } from 'react'
import classnames from 'classnames'
import gsap from 'gsap'
import styles from './BioOverlay.module.scss'
import useStore from '@/store'
import useI18n from '@/hooks/use-i18n'
import SanityImage from '@/components/SanityImage/SanityImage'
import { SanityImage as SanityImageType } from '@/types/sanity/SanityImage'
import RichText from '@/components/RichText/RichText'
import { ScrollContext } from '@/context/Scroll'
import SplitTextComponent, { SplitTextRef } from '@/components/SplitTextComponent/SplitTextComponent'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import Icon from '@/components/Icon/Icon'
import RichTextSplitText, { RichTextSplitTextRef } from '@/components/RichTextSplitText/RichTextSplitText'
import MaskReveal, { MaskRevealRef } from '@/components/MaskReveal/MaskReveal'
import FadeIn, { FadeInRef } from '@/components/FadeIn/FadeIn'
import useBreakpoint from '@/hooks/use-breakpoint'

export type BioOverlayData = SanityPerson

const REVEAL_DURATION = 1.2
const OUT_DURATION = 0.6
const LONG_NAME_THRESHOLD = 10

const BioOverlay = () => {
  const [isActive, setIsActive] = useState(false)
  const bioOverlayData = useStore(state => state.bioOverlayData)
  const setBioOverlayData = useStore(state => state.setBioOverlayData)
  const { scroll } = useContext(ScrollContext)
  const { i18n } = useI18n()
  const { isMobile } = useBreakpoint()

  const backgroundOverlayRef = useRef<HTMLDivElement>(null)
  const innerMaskRevealRef = useRef<MaskRevealRef>(null)
  const greenBgMaskRevealRef = useRef<MaskRevealRef>(null)
  const imageMaskRevealRef = useRef<MaskRevealRef>(null)
  const bioLabelFadeInDesktopRef = useRef<FadeInRef>(null)
  const bioLabelFadeInMobileRef = useRef<FadeInRef>(null)
  const designationsFadeInDesktopRef = useRef<FadeInRef>(null)
  const designationsFadeInMobileRef = useRef<FadeInRef>(null)
  const bioFadeInRef = useRef<FadeInRef>(null)
  const firstNameSplitTextRef = useRef<SplitTextRef>(null)
  const lastNameSplitTextRef = useRef<SplitTextRef>(null)
  const summarySplitTextRef = useRef<RichTextSplitTextRef>(null)

  useEffect(() => {
    if (!scroll) return
    if (isActive) {
      scroll.stop()
    } else {
      scroll.start()
    }
  }, [scroll, isActive])

  const animateIn = () => {
    setIsActive(true)

    gsap.to(backgroundOverlayRef.current, { opacity: 1, duration: 0.5 })

    innerMaskRevealRef.current?.animateIn()
    greenBgMaskRevealRef.current?.animateIn()

    gsap.delayedCall(REVEAL_DURATION * 0.5, () => {
      firstNameSplitTextRef.current?.animateIn()
      bioLabelFadeInDesktopRef.current?.animateIn()
      bioLabelFadeInMobileRef.current?.animateIn()
      imageMaskRevealRef.current?.animateIn()

      gsap.delayedCall(0.1, () => {
        lastNameSplitTextRef.current?.animateIn()
      })
    })

    gsap.delayedCall(REVEAL_DURATION * 0.75, () => {
      designationsFadeInDesktopRef.current?.animateIn()
      designationsFadeInMobileRef.current?.animateIn()
      summarySplitTextRef.current?.animateIn()
      bioFadeInRef.current?.animateIn()
    })
  }

  const animateOut = () => {
    innerMaskRevealRef.current?.animateOut()
    greenBgMaskRevealRef.current?.animateOut()
    gsap.to(backgroundOverlayRef.current, { opacity: 0, duration: OUT_DURATION })
    gsap.delayedCall(OUT_DURATION, () => {
      setIsActive(false)
      setBioOverlayData(null)
    })
  }

  useEffect(() => {
    if (bioOverlayData) {
      animateIn()
    }
  }, [bioOverlayData])

  const handleClose = () => {
    animateOut()
  }

  if (!bioOverlayData && !isActive) return null

  const maskRevealConfig = {
    inConfig: {
      duration: REVEAL_DURATION,
      ease: 'Power3.easeInOut',
    },
    outConfig: {
      duration: OUT_DURATION,
    },
    direction: 'FROM_RIGHT',
  }

  const isLongName =
    (bioOverlayData?.firstName?.length ?? 0) > LONG_NAME_THRESHOLD ||
    (bioOverlayData?.lastName?.length ?? 0) > LONG_NAME_THRESHOLD

  return (
    <div className={classnames(styles.BioOverlay, { [styles.active]: isActive, [styles.isLongName]: isLongName })}>
      <div
        ref={backgroundOverlayRef}
        className={styles.backgroundOverlay}
        role="button"
        aria-label="Close Overlay"
        onClick={handleClose}
      />
      <MaskReveal
        ref={greenBgMaskRevealRef}
        className={styles.greenBg}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(maskRevealConfig as any)}
      >
        <div />
      </MaskReveal>
      <MaskReveal
        className={styles.inner}
        lenisPrevent
        ref={innerMaskRevealRef}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(maskRevealConfig as any)}
      >
        <div className={styles.innerContent}>
          <div className={styles.topCloseContainer}>
            <FadeIn
              ref={bioLabelFadeInMobileRef}
              className={styles.bioLabelMobile}
            >
              <span className={styles.bioLabel}>{i18n('bio')}</span>
            </FadeIn>
            <LineAnimation
              position={isMobile ? 'bottom' : 'top'}
              animateFrom="left"
              startFull
              className={styles.topCloseLine__horizontal}
            />
            <div className={styles.closeButtonContainer}>
              <LineAnimation
                position="left"
                animateFrom="top"
                startFull
                className={styles.topCloseLine__vertical}
              />
              <button
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="Close Overlay"
              >
                <Icon name="x" />
              </button>
            </div>
          </div>

          <div className={styles.topContent}>
            {bioOverlayData?.image && (
              <MaskReveal
                ref={imageMaskRevealRef}
                className={styles.imageWrapper}
              >
                <SanityImage
                  source={bioOverlayData.image as SanityImageType}
                  className={styles.image}
                  aspectRatio={336 / 448}
                  columns={{
                    tablet: 4,
                    xs: 6,
                  }}
                />
              </MaskReveal>
            )}
            <div className={styles.nameSection}>
              <FadeIn
                ref={bioLabelFadeInDesktopRef}
                className={styles.bioLabelDesktop}
              >
                <span className={styles.bioLabel}>{i18n('bio')}</span>
              </FadeIn>
              {bioOverlayData?.firstName && (
                <SplitTextComponent
                  className={styles.title}
                  ref={firstNameSplitTextRef}
                >
                  <p className={styles.firstName}>{bioOverlayData.firstName}</p>
                </SplitTextComponent>
              )}
              {bioOverlayData?.lastName && (
                <SplitTextComponent
                  className={styles.title}
                  ref={lastNameSplitTextRef}
                >
                  <p className={styles.lastName}>{bioOverlayData.lastName}</p>
                </SplitTextComponent>
              )}
              <FadeIn
                ref={designationsFadeInMobileRef}
                className={classnames(styles.designationContainer, styles.designationMobile)}
              >
                {bioOverlayData?.designation && <p className={styles.designation}>{bioOverlayData.designation}</p>}
                {bioOverlayData?.designation2 && <p className={styles.designation2}>{bioOverlayData.designation2}</p>}
              </FadeIn>
            </div>
          </div>

          <div className={styles.bottomContent}>
            <LineAnimation
              position="top"
              animateFrom="left"
              startFull
              className={styles.bottomContent__lineAnimationHorizontal}
            />
            <div className={styles.leftColumn}>
              <FadeIn
                ref={designationsFadeInDesktopRef}
                className={classnames(styles.designationContainer, styles.designationDesktop)}
              >
                {bioOverlayData?.designation && <p className={styles.designation}>{bioOverlayData.designation}</p>}
                {bioOverlayData?.designation2 && <p className={styles.designation2}>{bioOverlayData.designation2}</p>}
              </FadeIn>
            </div>
            <div className={styles.rightColumn}>
              <LineAnimation
                position="left"
                animateFrom="top"
                startFull
                className={styles.bottomContent__lineAnimationVertical}
              />
              {!!bioOverlayData?.bioSummary?.length && (
                <div className={styles.summary}>
                  <RichTextSplitText
                    ref={summarySplitTextRef}
                    content={bioOverlayData.bioSummary}
                    revertOnAnimateIn
                  />
                </div>
              )}
              {!!bioOverlayData?.bio?.length && (
                <FadeIn ref={bioFadeInRef}>
                  <div className={styles.bio}>
                    <RichText content={bioOverlayData.bio} />
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </MaskReveal>
    </div>
  )
}

BioOverlay.displayName = 'BioOverlay'

export default BioOverlay
