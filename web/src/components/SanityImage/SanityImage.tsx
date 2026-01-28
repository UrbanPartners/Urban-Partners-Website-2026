'use client'

import NextImage from 'next/image'
import React, { CSSProperties, ForwardedRef, forwardRef, useMemo, useState } from 'react'
import styles from './SanityImage.module.scss'
import { ImageBuilderOptions, ImageProps } from '@/types/sanity/SanityImage'
import { BREAKPOINTS, columnToVw, getImageUrl, IMAGE_SRC_SET_WIDTHS, imageLoader } from './SanityImage.helper'
import useInView from '@/hooks/use-in-view'

const Image = (props: ImageProps, ref: ForwardedRef<HTMLImageElement | null>) => {
  const {
    className,
    source,
    columns = 12,
    onReady,
    dpr,
    blur,
    preload,
    animated = true,
    quality = 80,
    width,
    height,
    aspectRatio,
    isCover = false,
    alt,
  } = props
  const isString = typeof source === 'string'
  const [isLoaded, setIsLoaded] = useState(false)
  const { setElementToObserve, isInView } = useInView({
    scrolltriggerStart: 'top-=600px bottom',
  })

  const sourceProps = useMemo(() => {
    if (isString) return null
    const props = {
      width: width || source?.asset?.width,
      height: height || source?.asset?.height,
      dpr,
      blur,
      quality,
      isCover,
    }

    if (typeof aspectRatio === 'number') {
      props.height = Math.round(props.width / aspectRatio)
    }

    return props
  }, [source, dpr, blur, quality, width, height, aspectRatio, isCover, isString])

  const sizes = useMemo(() => {
    if (typeof columns === 'number') {
      return `${columnToVw(columns)}`
    } else if (typeof columns === 'string') {
      return columns
    } else {
      const imageSizeArray = Object.keys(BREAKPOINTS)
        .reverse()
        .map(breakpointKey => {
          if (columns[breakpointKey as keyof typeof columns]) {
            const value = columnToVw(columns[breakpointKey as keyof typeof columns])
            return `(min-width: ${BREAKPOINTS[breakpointKey]}px) ${value}`
          }
        })
        .filter(item => item)
        .join(', ')

      return imageSizeArray
    }
  }, [columns])

  const croppedImageSources = useMemo(() => {
    if (isString) return null
    if (Object.keys(columns)?.length === 0) return null

    const imageSourcesByBreakpoint = Object.keys(BREAKPOINTS)
      .reverse()
      .map(breakpointKey => {
        let aspectRatioValue: number | undefined = source?.asset?.aspectRatio

        if (aspectRatio) {
          if (typeof aspectRatio === 'number') {
            aspectRatioValue = aspectRatio
          } else if (Object.keys(aspectRatio).length > 0) {
            if (aspectRatio[breakpointKey as keyof typeof aspectRatio]) {
              aspectRatioValue = aspectRatio[breakpointKey as keyof typeof aspectRatio]
            }
          }
        }

        if (!aspectRatioValue) return null

        if (!columns[breakpointKey as keyof typeof columns]) return null

        if (aspectRatioValue) {
          const vw = columnToVw(columns[breakpointKey as keyof typeof columns])

          const srcSet = IMAGE_SRC_SET_WIDTHS.map(width => {
            return `${getImageUrl(source, {
              width,
              height: Math.round(width / aspectRatioValue),
              isCover,
            })} ${width}w`
          }).join(', ')

          return (
            <source
              srcSet={srcSet}
              media={`(min-width: ${BREAKPOINTS[breakpointKey]}px)`}
              sizes={vw}
              key={breakpointKey}
            />
          )
        }
      })
      .filter(item => item)

    return imageSourcesByBreakpoint
  }, [aspectRatio, source, columns, isCover, isString])

  const classNames = useMemo(() => {
    return `
      ${className} 
      ${styles.image} 
      ${animated && styles.animated} 
      ${isCover && styles.isCover} 
      ${isLoaded && styles.isLoaded}
    `
  }, [className, animated, isCover, isLoaded])

  const handleOnLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    if (onReady) onReady(target)
    if (target && animated) {
      setIsLoaded(true)
    }
  }

  const dataColumns = useMemo(() => {
    if (Object.keys(columns)?.length > 0) {
      return Object.keys(columns)
        .map(key => `${key}: ${columns[key as keyof typeof columns]}`)
        .join('; ')
    }
    return columns
  }, [columns])

  /* eslint-disable */
  if (isString) {
    return (
      <img
        src={source as string}
        alt={alt || ''}
        className={classNames}
        onLoad={handleOnLoad}
      />
    )
  }
  /* eslint-enable */

  const imageElement = (
    <NextImage
      loader={imageLoader}
      onLoad={handleOnLoad}
      ref={_ref => {
        setElementToObserve(_ref)
        if (ref) {
          // eslint-disable-next-line
          ;(ref as any).current = _ref as HTMLImageElement | null
        }
      }}
      priority={preload || isInView}
      data-is-preload={preload}
      className={classNames}
      alt={alt || source?.alt || ''}
      src={getImageUrl(source, sourceProps as ImageBuilderOptions)}
      style={
        {
          '--object-position': source?.hotspot ? `${source?.hotspot.x * 100}% ${source?.hotspot.y * 100}%` : 'center',
        } as CSSProperties
      }
      sizes={sizes}
      width={(sourceProps as ImageBuilderOptions).width || source?.asset?.width}
      height={(sourceProps as ImageBuilderOptions).height || source?.asset?.height}
      data-columns={dataColumns}
    />
  )

  if (!source) return null

  if (croppedImageSources && imageElement) {
    return (
      <picture>
        {croppedImageSources}
        {imageElement}
      </picture>
    )
  }

  return imageElement
}

export default forwardRef(Image)
