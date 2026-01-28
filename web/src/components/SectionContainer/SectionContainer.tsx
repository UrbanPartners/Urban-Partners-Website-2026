import styles from './SectionContainer.module.scss'
import { cloneElement, CSSProperties, useMemo, useRef } from 'react'
import { buildIdFromText } from '@/utils'
import classNames from 'classnames'
import useBreakpoint from '@/hooks/use-breakpoint'

const SectionContainer = ({
  _type,
  children,
  cmsTitle,
  sectionsLength,
  nextSectionType,
  sectionIndex,
  spacerSettings,
  isLastSection,
  id = undefined,
  zIndex = undefined,
}: SectionContainerProps) => {
  const containerRef = useRef<HTMLElement>(null)
  const _id = id || buildIdFromText(cmsTitle)
  const { isMobile } = useBreakpoint()

  const spacing = useMemo(() => {
    const spacing = {
      topDesktop: spacerSettings?.topDesktop,
      topMobile: spacerSettings?.topMobile,
      bottomDesktop: spacerSettings?.bottomDesktop,
      bottomMobile: spacerSettings?.bottomMobile,
    }

    Object.keys(spacing).forEach(key => {
      // If no value, just set to 'var(--section-spacing)'
      if (spacing[key as keyof typeof spacing] === undefined) {
        spacing[key as keyof typeof spacing] = 'var(--section-spacing)'
        return
      }

      // If it's null, set to '0px'
      if (spacing[key as keyof typeof spacing] === null) {
        spacing[key as keyof typeof spacing] = '0px'
        return
      }

      // if is equal to auto, set to 'var(--section-spacing)'
      if (spacing[key as keyof typeof spacing] === 'auto') {
        spacing[key as keyof typeof spacing] = 'var(--page-gutter)'
        return
      }

      // If there's number value, set to 'px'
      if (spacing[key as keyof typeof spacing] !== null && spacing[key as keyof typeof spacing] !== 'auto') {
        spacing[key as keyof typeof spacing] = `${spacing[key as keyof typeof spacing]}px`
        return
      }
    })

    return spacing
  }, [spacerSettings])

  const moveDown1Pixel = useMemo(() => {
    if (isMobile && spacing.bottomMobile === '0px') {
      return true
    }

    if (!isMobile && spacing.bottomDesktop === '0px') {
      return true
    }

    return false
  }, [spacing, isMobile])

  if (_type === 'spacer' && !children?.props?.hasLine) {
    return null
  }

  const newElement = cloneElement(children, {
    sectionId: _id,
    sectionIndex,
  })

  return (
    <section
      id={_id}
      ref={containerRef}
      data-component={_type}
      className={classNames(
        styles.SectionContainer,
        {
          [styles.isLastSection]: isLastSection,
        },
        {
          [styles.moveDown1Pixel]: moveDown1Pixel,
        },
      )}
      data-sections-length={sectionsLength}
      data-section-next-section-type={nextSectionType}
      style={
        {
          '--top-desktop': spacing.topDesktop,
          '--top-mobile': spacing.topMobile,
          '--bottom-desktop': spacing.bottomDesktop,
          '--bottom-mobile': spacing.bottomMobile,
          '--z-index': zIndex,
        } as CSSProperties
      }
    >
      {newElement}
    </section>
  )
}

SectionContainer.displayName = 'SectionContainer'

export default SectionContainer
