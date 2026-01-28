'use client'

import classnames from 'classnames'
import styles from './PagePromo.module.scss'
import SanityImage from '@/components/SanityImage/SanityImage'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import FadeIn from '@/components/FadeIn/FadeIn'
import RichText from '@/components/RichText/RichText'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import TextAndIconButton from '@/components/TextAndIconButton/TextAndIconButton'
import MaskReveal from '@/components/MaskReveal/MaskReveal'
import useBreakpoint from '@/hooks/use-breakpoint'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Link from '@/components/Link/Link'

const PagePromo = ({ className, title, subtitle, description, image, cta }: SanityPagePromo) => {
  const [isHovered, setIsHovered] = useState(false)
  const { isMobile } = useBreakpoint()
  const imageRef = useRef<HTMLImageElement>(null)

  const animateImage = (animateIn = true) => {
    if (!imageRef.current || isMobile) {
      return
    }

    gsap.killTweensOf(imageRef.current)
    gsap.to(imageRef.current, {
      scale: animateIn ? 1.1 : 1,
      duration: animateIn ? 1 : 0.6,
      ease: 'Power3.easeOut',
    })
  }

  useEffect(() => {
    if (isMobile) return
    animateImage(isHovered ? true : false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, isMobile])

  return (
    <div className={classnames(styles.PagePromo, className)}>
      <LineAnimation
        position="top"
        animateFrom="left"
        animateInView
      />
      <div className={styles.inner}>
        <div className={styles.leftSide}>
          {image && cta?.link && (
            <Link
              link={cta?.link}
              className={styles.imageLink}
              onMouseEnter={() => {
                setIsHovered(true)
              }}
              onMouseLeave={() => {
                setIsHovered(false)
              }}
            >
              <MaskReveal
                direction="FROM_TOP"
                animateWhenInView
                inConfig={{
                  duration: 1.2,
                  ease: 'Power3.easeInOut',
                }}
                className={styles.imageContainer}
              >
                <SanityImage
                  source={image}
                  aspectRatio={{
                    tablet: 1,
                    xs: 360 / 405,
                  }}
                  columns={{
                    tablet: 4,
                    xs: 12,
                  }}
                  className={styles.image}
                  ref={imageRef}
                />
              </MaskReveal>
            </Link>
          )}
        </div>
        <div className={styles.rightSide}>
          <LineAnimation
            position="left"
            animateFrom="top"
            animateInView
            className={styles.lineAnimationTop}
          />
          <div className={styles.textContent}>
            <div className={styles.textContent__top}>
              {title && (
                <SplitTextComponent
                  animateInView
                  element="h2"
                  className={styles.title}
                >
                  <span>{title}</span>
                </SplitTextComponent>
              )}
            </div>
            <div className={styles.textContent__middle}>
              <LineAnimation
                position="top"
                animateFrom="left"
                animateInView
              />
              {subtitle && (
                <SplitTextComponent
                  animateInView
                  element="h3"
                  className={styles.subtitle}
                >
                  <p className={styles.subtitleText}>{subtitle}</p>
                </SplitTextComponent>
              )}
              <div className={styles.descriptionContainer}>
                <LineAnimation
                  position="left"
                  animateFrom="top"
                  size="tiny"
                  animateInView
                  className={styles.ctaLineAnimation}
                />
                {description && (
                  <FadeIn
                    animateInView
                    className={styles.description}
                  >
                    <RichText content={description} />
                  </FadeIn>
                )}
              </div>
            </div>
            <div className={styles.textContent__bottom}>
              <LineAnimation
                position="bottom"
                animateFrom="left"
                animateInView
                className={styles.ctaLineAnimation}
              />
              <div />
              {cta && (
                <div className={styles.ctaContainer}>
                  <TextAndIconButton
                    link={{
                      ...cta.link,
                      label: isMobile ? subtitle : cta.link.label,
                    }}
                    icon={cta.icon}
                    style={isMobile ? 'full-solid-button' : 'full-line-left'}
                    onMouseEnter={() => {
                      setIsHovered(true)
                    }}
                    onMouseLeave={() => {
                      setIsHovered(false)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

PagePromo.displayName = 'PagePromo'

export default PagePromo
