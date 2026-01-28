'use client'

import { useRef, useEffect, useState } from 'react'
import classnames from 'classnames'
import styles from './ExpandingImageAndContent.module.scss'
import RichText from '@/components/RichText/RichText'
import ItemList from '@/components/ItemList/ItemList'
import TextAndIconButton from '@/components/TextAndIconButton/TextAndIconButton'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import useWindowResize from '@/hooks/use-window-resize'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import FadeIn from '@/components/FadeIn/FadeIn'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import useInView from '@/hooks/use-in-view'
import Media from '@/components/Media/Media'
import useBreakpoint from '@/hooks/use-breakpoint'

ScrollTrigger.config({
  ignoreMobileResize: true,
})

gsap.registerPlugin(ScrollTrigger)

const ExpandingImageAndContent = ({ className, items }: SanityExpandingImageAndContent) => {
  const { setElementToObserve } = useInView({
    scrolltriggerStart: 'top-=500px bottom',
    scrolltriggerEnd: 'bottom+=200px top',
  })

  if (!items?.length) {
    return null
  }

  return (
    <div
      className={classnames(styles.ExpandingImageAndContent, className)}
      ref={ref => {
        setElementToObserve(ref)
      }}
    >
      <div className={styles.inner}>
        {items.map((item, index) => (
          <ExpandingImageAndContentItem
            key={`${item._key}_${index}`}
            item={item}
            index={index}
          />
        ))}
      </div>
      <LineAnimation
        position="bottom"
        animateFrom="left"
        animateInView
      />
    </div>
  )
}

const ExpandingImageAndContentItem = ({ item }: { item: SanityExpandingImageAndContentItem; index: number }) => {
  const bigImageRef = useRef<HTMLDivElement | null>(null)
  const smallImageRef = useRef<HTMLDivElement | null>(null)
  const imageContainerRef = useRef<HTMLDivElement | null>(null)
  const imageContainerInnerRef = useRef<HTMLDivElement | null>(null)
  const [aspectRatio, setAspectRatio] = useState<number>(1)
  const resizeKey = useWindowResize()
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const scrollTriggerComplete = useRef<boolean>(false)
  const { isMobile } = useBreakpoint()
  const [allowCalc, setAllowCalc] = useState(false)
  const { isInView, setElementToObserve } = useInView()
  const $container = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setAllowCalc(true)
    }, 200)
  }, [])

  useEffect(() => {
    if (!allowCalc) return

    if (bigImageRef.current) {
      const width = bigImageRef.current.offsetWidth
      const height = bigImageRef.current.offsetHeight
      const ratio = width / height
      setAspectRatio(ratio)
    }
  }, [resizeKey, isInView, allowCalc])

  useEffect(() => {
    if (!isMobile) return
    if (!isInView) return

    if (timelineRef.current && isInView) {
      timelineRef.current.play()
    }
  }, [isInView, isMobile])

  useEffect(() => {
    if (!allowCalc || !$container.current) return

    // Kill existing ScrollTrigger and timeline
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
      scrollTriggerRef.current = null
    }
    if (timelineRef.current) {
      timelineRef.current.kill()
      timelineRef.current = null
    }

    if (scrollTriggerComplete.current) return

    const smallImageContainer = smallImageRef.current
    const imageContainerInner = imageContainerInnerRef.current
    const imageContainer = imageContainerRef.current

    if (!smallImageContainer || !imageContainerInner || !imageContainer) return

    const media = imageContainer.querySelector(`.${styles.media}`)

    if (!media) return
    // Calculate dimensions
    const bigRect = imageContainerInner.getBoundingClientRect()
    const smallRect = smallImageContainer.getBoundingClientRect()

    const scaleX = bigRect.width / smallRect.width
    const scaleY = bigRect.height / smallRect.height

    // Create timeline
    const timeline = gsap.timeline({
      paused: true,
    })

    const duration = 1.2
    const ease = isMobile ? 'Power3.easeOut' : 'none'

    timeline.to(smallImageContainer, {
      scaleX,
      scaleY,
      ease,
      duration,
    })

    timeline.fromTo(
      media,
      {
        scale: 1.3,
      },
      {
        scale: 1,
        duration,
        ease,
      },
      '0',
    )

    // Store timeline in ref
    timelineRef.current = timeline

    // Create ScrollTrigger
    if (!isMobile) {
      const trigger = ScrollTrigger.create({
        trigger: $container.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        animation: timeline,
        onLeave: () => {
          timeline.kill()
          trigger.kill()
          scrollTriggerComplete.current = true
        },
      })

      scrollTriggerRef.current = trigger
    }

    return () => {
      scrollTriggerRef.current?.kill()
      scrollTriggerRef.current = null
      timelineRef.current?.kill()
      timelineRef.current = null
    }
  }, [aspectRatio, allowCalc, isMobile])

  return (
    <div
      ref={ref => {
        if (ref) {
          $container.current = ref
          setElementToObserve(ref)
        }
      }}
      className={styles.item}
      style={
        {
          '--image-aspect-ratio': aspectRatio || 1,
        } as React.CSSProperties
      }
    >
      <LineAnimation
        position="top"
        animateFrom="left"
        animateInView
      />
      <div className={styles.content}>
        {!isMobile && (
          <LineAnimation
            position="right"
            animateFrom="top"
            animateInView
          />
        )}
        <SplitTextComponent
          animateInView
          className={styles.title}
        >
          <h2 className={styles.titleText}>{item.title}</h2>
        </SplitTextComponent>

        {item.description && (
          <FadeIn
            animateInView
            className={styles.description}
          >
            <RichText content={item.description} />
          </FadeIn>
        )}
        {item.cta && (
          <FadeIn
            animateInView
            className={styles.ctaContainer}
          >
            <TextAndIconButton
              style="short"
              link={item.cta}
              className={styles.cta}
            />
          </FadeIn>
        )}
        {item.itemList && (
          <ItemList
            {...item.itemList}
            className={styles.itemList}
            animateInView
          />
        )}
      </div>
      <div
        ref={imageContainerRef}
        className={styles.imageContainer}
      >
        <div
          ref={imageContainerInnerRef}
          className={styles.imageContainerInner}
        >
          <div
            ref={smallImageRef}
            className={styles.smallImageContainer}
          >
            {item.media && (
              <Media
                cover
                source={item.media}
                className={styles.media}
                imageProps={{
                  aspectRatio: {
                    tablet: 1.4,
                    mobile: 360 / 435,
                    xs: 360 / 435,
                  },
                  columns: {
                    tablet: 8,
                    mobile: 5,
                    xs: 12,
                  },
                }}
              />
            )}
          </div>
          <div
            ref={bigImageRef}
            className={styles.bigImageContainer}
          />
        </div>
      </div>
    </div>
  )
}

ExpandingImageAndContent.displayName = 'ExpandingImageAndContent'

export default ExpandingImageAndContent
