'use client'

import classnames from 'classnames'
import styles from './FeaturedArticle.module.scss'
import SanityImage from '@/components/SanityImage/SanityImage'
import Link from '@/components/Link/Link'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import FadeIn from '@/components/FadeIn/FadeIn'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import LineBreakElement from '@/components/LineBreakElement/LineBreakElement'
import ArrowButton, { ArrowButtonRef } from '@/components/ArrowButton/ArrowButton'
import { useEffect, useRef, useState } from 'react'
import TextAndIconButton, { TextAndIconButtonRef } from '@/components/TextAndIconButton/TextAndIconButton'
import MaskReveal from '@/components/MaskReveal/MaskReveal'
import useBreakpoint from '@/hooks/use-breakpoint'
import gsap from 'gsap'
import ColorBar, { ColorBarRef } from '@/components/ColorBar/ColorBar'

const FeaturedArticle = ({ variant, ...props }: SanityFeaturedArticle) => {
  if (variant === 'a') {
    return (
      <FeaturedArticleVariantA
        {...props}
        variant={variant}
      />
    )
  }

  if (variant === 'b') {
    return (
      <FeaturedArticleVariantB
        {...props}
        variant={variant}
      />
    )
  }

  return null
}

const FeaturedArticleVariantA = ({ className, linksTo, title, description, image }: SanityFeaturedArticle) => {
  const arrowButtonRef = useRef<ArrowButtonRef>(null)
  const [isHovering, setIsHovering] = useState(false)
  const { isMobile } = useBreakpoint()
  const colorBarRef = useRef<ColorBarRef>(null)

  useEffect(() => {
    if (isHovering) {
      colorBarRef.current?.animateIn()
      arrowButtonRef.current?.setIsHover(true)
    } else {
      colorBarRef.current?.animateOut()
      arrowButtonRef.current?.setIsHover(false)
    }
  }, [isHovering])

  if (!linksTo) {
    return null
  }

  return (
    <div className={classnames(styles.FeaturedArticleVariantA, className)}>
      <div className={styles.inner}>
        <MaskReveal
          animateWhenInView={isMobile !== null}
          className={styles.imageContainer}
          hasSubtleBg
          longerDuration
          maskType={isMobile ? 'default' : 'twoColumns'}
          revertOnAnimateInComplete={true}
        >
          {image && (
            <SanityImage
              source={image}
              columns={{
                tablet: 12,
                xs: 12,
              }}
              aspectRatio={{
                tablet: 1920 / 960,
                xs: 390 / 570,
              }}
            />
          )}
        </MaskReveal>
        <Link
          className={styles.textContent}
          link={linksTo}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className={styles.titleContainer}>
            {title && (
              <SplitTextComponent
                animateInView
                className={styles.title}
                // revertOnAnimateIn={false}
              >
                <LineBreakElement
                  className={styles.titleText}
                  text={title}
                />
              </SplitTextComponent>
            )}
          </div>
          <div className={styles.descriptionContainer}>
            <LineAnimation
              position="left"
              animateFrom="top"
              animateInView
              size="tiny"
            />
            {description && (
              <FadeIn
                animateInView
                className={styles.description}
              >
                {description}
              </FadeIn>
            )}
            <div className={styles.arrowButtonContainer}>
              <ColorBar
                className={styles.colorBar}
                transformOrigin="left"
                ref={colorBarRef}
              />
              <ArrowButton
                disableOnHover
                iconName="arrowRight"
                element="span"
                className={styles.arrowButton}
                ref={arrowButtonRef}
                hiddenIconClassName={styles.hiddenIcon}
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

const FeaturedArticleVariantB = ({ className, linksTo, title, description, image }: SanityFeaturedArticle) => {
  const arrowButtonRef = useRef<TextAndIconButtonRef>(null)
  const [isHovering, setIsHovering] = useState(false)
  const { isMobile } = useBreakpoint()
  const imageRef = useRef<HTMLImageElement | null>(null)

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
    if (isHovering) {
      arrowButtonRef.current?.setIsHover(true)
      animateImage(true)
    } else {
      arrowButtonRef.current?.setIsHover(false)
      animateImage(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering])

  if (!linksTo) {
    return null
  }

  const textContent = (
    <>
      <div className={styles.titleContainer}>
        {title && (
          <SplitTextComponent
            animateInView
            className={styles.title}
            // revertOnAnimateIn={false}
          >
            <LineBreakElement
              className={styles.titleText}
              text={title}
            />
          </SplitTextComponent>
        )}
      </div>
      <div className={styles.descriptionContainer}>
        {description && (
          <FadeIn
            animateInView
            className={styles.description}
          >
            {description}
          </FadeIn>
        )}
      </div>
      <TextAndIconButton
        style="full"
        icon="arrowRight"
        label="Read More"
        className={styles.arrowButton}
        element="span"
        link={isMobile ? linksTo : undefined}
        disableOnHover
        ref={arrowButtonRef}
      />
    </>
  )

  return (
    <div className={classnames(styles.FeaturedArticleVariantB, className)}>
      <LineAnimation
        position="top"
        animateFrom="left"
        startFull
      />
      <LineAnimation
        position="bottom"
        animateFrom="left"
        startFull
        className={styles.lineAnimationBottom}
      />
      <div className={styles.inner}>
        <div className={styles.left}>
          {isMobile ? (
            <div className={styles.textContent}>{textContent}</div>
          ) : (
            <Link
              className={styles.textContent}
              link={linksTo}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {textContent}
            </Link>
          )}
        </div>
        <div className={styles.right}>
          <LineAnimation
            position="left"
            animateFrom="top"
            animateInView
          />
          <MaskReveal
            animateWhenInView
            className={styles.imageContainer}
          >
            {image && (
              <SanityImage
                source={image}
                columns={{
                  tablet: 12,
                  xs: 12,
                }}
                aspectRatio={{
                  tablet: 1920 / 960,
                  xs: 357 / 525,
                }}
                ref={imageRef}
                className={styles.image}
              />
            )}
          </MaskReveal>
        </div>
      </div>
    </div>
  )
}

FeaturedArticle.displayName = 'FeaturedArticle'

export default FeaturedArticle
