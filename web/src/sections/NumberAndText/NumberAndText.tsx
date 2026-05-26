'use client'

import { ChangeEvent, FocusEvent, forwardRef, useMemo, useRef } from 'react'
import classnames from 'classnames'
import styles from './NumberAndText.module.scss'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import FadeIn from '@/components/FadeIn/FadeIn'
import RichText from '@/components/RichText/RichText'
import TextAndIconButton from '@/components/TextAndIconButton/TextAndIconButton'
import RichTextSplitText from '@/components/RichTextSplitText/RichTextSplitText'
import { resolveLinkHref } from '@/components/Link/Link'
import useBreakpoint from '@/hooks/use-breakpoint'
import useCurrentPage from '@/hooks/use-current-page'

const NumberAndText = ({
  className,
  number,
  description,
  subheading,
  subheadingDescription,
  cta,
  linkDropdownItems,
}: SanityNumberAndText) => {
  const hasSubheadingContent = subheading?.length || !!subheadingDescription?.length
  const hasCta = !!cta && cta?.link?.linkType !== 'disabled'
  const hasDropdown = !!linkDropdownItems?.length
  const hasBottomContent = hasSubheadingContent || hasCta
  const { isMobile } = useBreakpoint()
  const selectLinkDropdownRef = useRef<HTMLSelectElement>(null)

  const handleCtaFocus = (event: FocusEvent<HTMLButtonElement | HTMLSpanElement>) => {
    if (!selectLinkDropdownRef.current) return
    event.currentTarget.blur()
    selectLinkDropdownRef.current.focus()
  }

  if (!number) {
    return null
  }

  return (
    <div
      className={classnames(styles.NumberAndText, className, {
        [styles.hasCTA]: hasCta,
      })}
    >
      <LineAnimation
        position="top"
        animateFrom="left"
        animateInView
        longerDuration
      />
      {hasCta && (
        <LineAnimation
          position="bottom"
          animateFrom="left"
          animateInView
          longerDuration
        />
      )}

      <div className={styles.inner}>
        <div className={styles.numberContainer}>
          <FadeIn
            animateInView
            className={styles.numberWrapper}
          >
            <div className={styles.number}>{number}</div>
          </FadeIn>
        </div>
        <div className={styles.descriptionContainer}>
          <div className={styles.descriptionContent}>
            {!!description?.length && (
              <RichTextSplitText
                className={styles.description}
                content={description}
                splitTextProps={{
                  animateInView: true,
                }}
              />
            )}
          </div>
          {hasBottomContent && (
            <div className={styles.bottomContent}>
              {hasSubheadingContent && (
                <div className={styles.subheadingContent}>
                  <FadeIn animateInView>
                    <p className={styles.subheading}>{subheading}</p>
                  </FadeIn>
                  {!!subheadingDescription?.length && (
                    <FadeIn
                      animateInView
                      className={styles.subheadingDescription}
                    >
                      <RichText content={subheadingDescription} />
                    </FadeIn>
                  )}
                </div>
              )}
              {hasCta && (
                <FadeIn
                  animateInView
                  className={styles.ctaContainer}
                >
                  <div className={styles.ctaWrapper}>
                    <TextAndIconButton
                      link={!hasDropdown ? cta.link : undefined}
                      icon={cta.icon}
                      label={hasDropdown ? cta.link?.label : undefined}
                      className={classnames(styles.cta)}
                      style={isMobile ? 'full' : 'full-line-left'}
                      onFocus={hasDropdown ? handleCtaFocus : undefined}
                    />
                    {hasDropdown && (
                      <SelectLinkDropdown
                        ref={selectLinkDropdownRef}
                        items={linkDropdownItems}
                        ariaLabel={cta.link?.label}
                      />
                    )}
                  </div>
                </FadeIn>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

NumberAndText.displayName = 'NumberAndText'

type SelectLinkDropdownProps = {
  className?: string
  items: SanityLink[]
  ariaLabel?: string
}

const SelectLinkDropdown = forwardRef<HTMLSelectElement, SelectLinkDropdownProps>(
  ({ className, items, ariaLabel }, ref) => {
    const { currentLanguage } = useCurrentPage()

    const options = useMemo(() => {
      return items
        .map(item => {
          const basePath = resolveLinkHref(item, currentLanguage as string)
          const href = basePath ? `${basePath}${item.hash ? `#${item.hash}` : ''}` : ''
          return {
            label: item.label || '',
            value: href,
          }
        })
        .filter(option => option.value && option.label)
    }, [items, currentLanguage])

    if (!options.length) {
      return null
    }

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value
      event.target.selectedIndex = 0
      if (!value) return
      window.open(value, '_blank', 'noopener,noreferrer')
    }

    return (
      <select
        ref={ref}
        className={classnames(styles.selectLinkDropdown, className)}
        aria-label={ariaLabel || 'Select a link'}
        onChange={handleChange}
        defaultValue=""
      >
        <option
          value=""
          disabled
          hidden
        />
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    )
  },
)

SelectLinkDropdown.displayName = 'SelectLinkDropdown'

export default NumberAndText
