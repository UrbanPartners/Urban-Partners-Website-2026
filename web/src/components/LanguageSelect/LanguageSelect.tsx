'use client'

import { useState, useRef, useEffect } from 'react'
import classnames from 'classnames'
import styles from './LanguageSelect.module.scss'
import { DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_COOKIE_EXPIRY_SECONDS, LANGUAGE_COOKIE_NAME } from '@/data'
import useCurrentPage from '@/hooks/use-current-page'
import { setCookie, getUrlFromPageData } from '@/utils'
import Icon from '@/components/Icon/Icon'
import gsap from 'gsap'
import { useRouter } from 'next/navigation'
import TextSwapper, { TextSwapperRef } from '@/components/TextSwapper/TextSwapper'

function capitalizeAll(str: string) {
  return str.toUpperCase()
}

type LanguageSelectProps = {
  className?: string
  theme?: 'light' | 'dark'
}

const LanguageSelect = ({ className, theme = 'dark' }: LanguageSelectProps) => {
  const { currentLanguage, currentSlug, currentDocType } = useCurrentPage()
  const [focused, setFocused] = useState(false)
  const iconRef = useRef<SVGSVGElement | null>(null)
  const router = useRouter()
  const textSwapperRef = useRef<TextSwapperRef | null>(null)

  useEffect(() => {
    if (iconRef.current) {
      gsap.killTweensOf(iconRef.current)
      gsap.to(iconRef.current, {
        rotation: focused ? -180 : 0,
        duration: 0.3,
        ease: 'Power3.easeOut',
      })
    }
  }, [focused])

  return (
    <div
      className={classnames(styles.LanguageSelect, className, {
        [styles.focused]: focused,
        [styles.light]: theme === 'light',
        [styles.dark]: theme === 'dark',
      })}
      onMouseEnter={() => textSwapperRef.current?.swapText()}
      onMouseLeave={() => setFocused(false)}
      style={
        {
          '--fg-color': theme === 'light' ? 'var(--grey-5)' : 'var(--green-dark)',
        } as React.CSSProperties
      }
    >
      <TextSwapper
        label={currentLanguage as string}
        className={styles.textSwapper}
        ref={textSwapperRef}
      />
      <select
        className={styles.select}
        value={currentLanguage}
        onClick={() => setFocused(true)}
        onChange={e => {
          const selectedLanguage = e.target.value
          setCookie({
            name: LANGUAGE_COOKIE_NAME,
            value: selectedLanguage,
            maxAge: LANGUAGE_COOKIE_EXPIRY_SECONDS,
          })

          // Navigate to the same page in the selected language (same logic as Link component)
          const urlPath = getUrlFromPageData(currentDocType, currentSlug !== DEFAULT_LANGUAGE ? currentSlug : '')
          let path = `/${selectedLanguage}`
          if (path !== urlPath) {
            path = `/${selectedLanguage}${urlPath}`
          }

          // Default lang structuring
          if (path.startsWith(`/${DEFAULT_LANGUAGE}`)) {
            path = path.replace(`/${DEFAULT_LANGUAGE}`, '')
            path = `${urlPath}`
          }

          if (path === `/${DEFAULT_LANGUAGE}`) {
            path = '/'
          }

          router.push(path)
        }}
      >
        {Object.values(LANGUAGES).map((language, i) => (
          <option
            key={`${language}_${i}`}
            value={language}
          >
            {capitalizeAll(language)}
          </option>
        ))}
      </select>
      <Icon
        ref={iconRef}
        name="arrowDown"
        className={styles.icon}
      />
    </div>
  )
}

LanguageSelect.displayName = 'LanguageSelect'

export default LanguageSelect
