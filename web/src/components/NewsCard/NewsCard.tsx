'use client'

import { useRef } from 'react'
import classnames from 'classnames'
import styles from './NewsCard.module.scss'
import Link from '@/components/Link/Link'
import SanityImage from '@/components/SanityImage/SanityImage'
import TextAndIconButton, { TextAndIconButtonRef } from '@/components/TextAndIconButton/TextAndIconButton'
import { DOC_TYPES } from '@/data'
import useI18n from '@/hooks/use-i18n'
import { SanityImage as SanityImageType } from '@/types/sanity/SanityImage'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import { formatDateToDDMMYYYY } from '@/utils'
import MaskReveal from '@/components/MaskReveal/MaskReveal'
import gsap from 'gsap'
import useBreakpoint from '@/hooks/use-breakpoint'

interface NewsCardProps {
  publishedDate: string
  slug: string
  image: SanityImageType
  title: string
  className?: string
}

const NewsCard = ({ className, publishedDate, slug, image, title }: NewsCardProps) => {
  const textAndIconButtonRef = useRef<TextAndIconButtonRef>(null)
  const { i18n } = useI18n()
  const imageRef = useRef<HTMLImageElement | null>(null)
  const { isMobile } = useBreakpoint()

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

  const handleMouseEnter = () => {
    animateImage(true)
    if (textAndIconButtonRef.current) {
      textAndIconButtonRef.current.setIsHover(true)
    }
  }

  const handleMouseLeave = () => {
    animateImage(false)
    if (textAndIconButtonRef.current) {
      textAndIconButtonRef.current.setIsHover(false)
    }
  }

  return (
    <Link
      className={classnames(styles.NewsCard, className)}
      link={{
        linkType: 'internal',
        link: {
          _type: DOC_TYPES.BLOG_POST,
          slug,
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.top}>
        {publishedDate && (
          <SplitTextComponent animateInView>
            <p className={styles.publishedDate}>{formatDateToDDMMYYYY(publishedDate)}</p>
          </SplitTextComponent>
        )}
      </div>
      <div className={styles.bottom}>
        <div className={styles.titleAndImageContainer}>
          <MaskReveal
            animateWhenInView
            className={styles.imageContainer}
          >
            <SanityImage
              source={image}
              columns={{
                tablet: 3,
                xs: 8,
              }}
              aspectRatio={{
                tablet: 480 / 320,
                xs: 1 / 1,
              }}
              className={styles.image}
              ref={imageRef}
            />
          </MaskReveal>
          <SplitTextComponent animateInView>
            <h3 className={styles.title}>{title}</h3>
          </SplitTextComponent>
        </div>
        <TextAndIconButton
          ref={textAndIconButtonRef}
          style="full"
          element="span"
          disableOnHover
          label={i18n('readArticle')}
        />
      </div>
    </Link>
  )
}

NewsCard.displayName = 'NewsCard'

export default NewsCard
