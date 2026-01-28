'use client'

import classnames from 'classnames'
import styles from './Preloader.module.scss'
import { GlobalSettingsContext } from '@/context/GlobalSettings'
import { useContext, useEffect, useRef, useState } from 'react'
import Icon from '@/components/Icon/Icon'
import SplitTextComponent, {
  SplitTextRef,
  DEFAULT_IN_CONFIG as SPLIT_TEXT_DEFAULT_IN_CONFIG,
} from '@/components/SplitTextComponent/SplitTextComponent'
import FadeIn, { FadeInRef } from '@/components/FadeIn/FadeIn'
import gsap from 'gsap'
import { wait } from '@/utils'
import MaskReveal, { MaskRevealRef } from '@/components/MaskReveal/MaskReveal'
import useStore from '@/store'
import useCurrentPage from '@/hooks/use-current-page'
import Cookies from 'js-cookie'
import { ALLOW_IS_IN_VIEW_DELAY_MS, PRELOADER_COOKIE_NAME } from '@/data'
import { ScrollContext } from '@/context/Scroll'

interface PreloaderComponentProps {
  className?: string
}

export const MASK_OUT_DURATION = 1.3
const LINE_ROTATION_DURATION = SPLIT_TEXT_DEFAULT_IN_CONFIG.duration * 0.8
const SHOW_PRELOADER_ALWAYS = true

const Preloader = ({ className }: PreloaderComponentProps) => {
  const { globalSettingsData } = useContext(GlobalSettingsContext)
  const preloader = globalSettingsData?.preloader
  const rotatingTextRefs = useRef<HTMLLIElement[]>([])
  const logoContainerRef = useRef<FadeInRef>(null)
  const outerRotatingTextListRef = useRef<HTMLDivElement>(null)
  const splitTextRef = useRef<SplitTextRef>(null)
  const bgLineRef = useRef<HTMLDivElement>(null)
  const loadingLineRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<GSAPTimeline | null>(null)
  const maskRevealRef = useRef<MaskRevealRef | null>(null)
  const setAllowIsInView = useStore(store => store.setAllowIsInView)
  const setPreloaderIsAnimatingOut = useStore(store => store.setPreloaderIsAnimatingOut)
  const { shouldShowPreloader } = useCurrentPage()
  const [render, setRender] = useState(shouldShowPreloader)
  const { scroll } = useContext(ScrollContext)
  const scrollDisablerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [disableScrollDisabler, setDisableScrollDisabler] = useState(true)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (scrollDisablerIntervalRef.current) {
      clearInterval(scrollDisablerIntervalRef.current)
    }
    if (disableScrollDisabler) {
      if (scroll) {
        scroll.start()
      }
      return
    }
    if (shouldShowPreloader) {
      Cookies.set(PRELOADER_COOKIE_NAME, 'true', { expires: SHOW_PRELOADER_ALWAYS ? -1 : 7 })
      scrollDisablerIntervalRef.current = setInterval(() => {
        if (scroll) {
          scroll.scrollTo(0, { immediate: true })
          window.scrollTo(0, 0)
          scroll.stop()
        }
      }, 10)
    }
  }, [shouldShowPreloader, scroll, disableScrollDisabler])

  useEffect(() => {
    if (shouldShowPreloader) {
      setDisableScrollDisabler(false)
    } else {
      setRender(false)
      setDisableScrollDisabler(true)
      setTimeout(() => {
        setAllowIsInView(true)
      }, ALLOW_IS_IN_VIEW_DELAY_MS)
    }
  }, [setAllowIsInView, shouldShowPreloader])

  const rotateText = () => {
    const firstRotatingTextRef = rotatingTextRefs.current[0]

    if (!firstRotatingTextRef || !loadingLineRef.current) {
      console.warn('First rotating text or loading line not found', {
        firstRotatingTextRef,
        loadingLineRef,
      })
      return
    }

    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    timelineRef.current = gsap.timeline()

    const duration = LINE_ROTATION_DURATION
    const ease = 'Power3.easeOut'

    const listElement = listRef.current
    const elHeight = firstRotatingTextRef.offsetHeight

    if (!listElement) return
    if (!elHeight) return

    timelineRef.current?.to(listElement, {
      y: -elHeight,
      duration,
      ease,
    })

    timelineRef.current?.to(
      loadingLineRef.current,
      {
        scaleY: 0.25,
        duration,
        ease,
      },
      '<',
    )

    timelineRef.current?.to(
      listElement,
      {
        y: -elHeight * 2,
        duration,
        ease,
      },
      `>+=${duration * 0.5}`,
    )

    timelineRef.current?.to(
      loadingLineRef.current,
      {
        scaleY: 0.5,
        duration,
        ease,
      },
      '<',
    )

    const finalDuration = duration * 1.7
    const finalEase = 'Power3.easeInOut'

    timelineRef.current?.to(
      listElement,
      {
        y: (listElement.offsetHeight - elHeight) * -1,
        duration: finalDuration,
        ease: finalEase,
      },
      `>+=${duration * 0.1}`,
    )

    timelineRef.current?.to(
      loadingLineRef.current,
      {
        scaleY: 1,
        duration: finalDuration,
        ease: finalEase,
      },
      '<',
    )

    if (splitTextRef.current) {
      timelineRef.current?.add(splitTextRef.current.animateOut, '>')
    }

    timelineRef.current?.to(
      listElement,
      {
        y: listElement.offsetHeight * -1,
        duration,
        delay: 0.075,
        ease,
      },
      '>',
    )

    if (maskRevealRef.current) {
      timelineRef.current?.add(maskRevealRef.current.animateOut, `<-=${duration * 0.75}`)
    }
  }

  const animateIn = async () => {
    await wait(10)

    const firstRotatingTextRef = rotatingTextRefs.current[0]

    if (!firstRotatingTextRef) return

    const elHeight = firstRotatingTextRef.offsetHeight

    gsap.set(outerRotatingTextListRef.current, { height: elHeight })

    if (logoContainerRef.current) {
      logoContainerRef.current.animateIn()
    }

    if (splitTextRef.current) {
      splitTextRef.current.animateIn()
    }

    if (listRef.current) {
      gsap.fromTo(
        listRef.current,
        {
          y: elHeight,
        },
        {
          ...SPLIT_TEXT_DEFAULT_IN_CONFIG,
          y: 0,
          onComplete: () => {
            rotateText()
          },
        },
      )
      gsap.set(listRef.current, { opacity: 1 })
    }

    if (bgLineRef.current) {
      gsap.to(bgLineRef.current, {
        scaleY: 1,
        duration: 1.8,
        ease: 'Power4.easeInOut',
      })
    }
  }

  useEffect(() => {
    if (!shouldShowPreloader) return
    animateIn()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShowPreloader])

  if (!preloader || !preloader?.rotatingTexts?.length || !preloader?.rotatingTextSuffix) {
    console.warn('No preloader data found')
    return null
  }

  if (!render || !shouldShowPreloader) {
    return null
  }

  return (
    <div className={classnames(styles.Preloader, className)}>
      <MaskReveal
        ref={maskRevealRef}
        className={styles.inner}
        maskType="twoColumns"
        showInitially
        direction="FROM_TOP"
        outConfig={{
          duration: MASK_OUT_DURATION,
          ease: 'Power3.easeInOut',
          secondColumnDelay: 1.3 * 0.2,
          onStart: () => {
            setPreloaderIsAnimatingOut(true)
            setTimeout(
              () => {
                setAllowIsInView(true)
              },
              MASK_OUT_DURATION * 1000 * 0.3,
            )
          },
          onComplete: () => {
            setRender(false)
            setDisableScrollDisabler(true)
          },
        }}
      >
        <FadeIn
          ref={logoContainerRef}
          className={styles.logoContainer}
        >
          <Icon
            name="logoWithWordmark"
            className={styles.logo}
          />
        </FadeIn>
        <div className={styles.left}>
          <div
            className={styles.rotatingTextListOuter}
            ref={outerRotatingTextListRef}
          >
            <ul
              ref={listRef}
              className={styles.rotatingTextList}
            >
              {preloader?.rotatingTexts.map((text, index) => (
                <li
                  key={index}
                  className={styles.rotatingText}
                  ref={el => {
                    if (rotatingTextRefs.current) {
                      rotatingTextRefs.current[index] = el as HTMLLIElement
                    }
                  }}
                >
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rotatingTextSuffixContainer}>
            <SplitTextComponent
              ref={splitTextRef}
              className={styles.rotatingTextSuffix}
              inConfig={{
                delay: 0.1,
              }}
              outConfig={{
                y: '-110%',
                duration: LINE_ROTATION_DURATION,
              }}
              revertOnAnimateIn={false}
            >
              {preloader?.rotatingTextSuffix}
            </SplitTextComponent>
          </div>
        </div>
        <div className={styles.loadingLineContainer}>
          <div
            ref={bgLineRef}
            className={styles.bgLine}
          />
          <div
            ref={loadingLineRef}
            className={styles.loadingLine}
          />
        </div>
      </MaskReveal>
    </div>
  )
}

Preloader.displayName = 'Preloader'

export default Preloader
