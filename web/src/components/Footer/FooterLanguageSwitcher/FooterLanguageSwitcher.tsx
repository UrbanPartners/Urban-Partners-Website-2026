'use client'

import classnames from 'classnames'
import styles from './FooterLanguageSwitcher.module.scss'
import { DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_COOKIE_EXPIRY_SECONDS, LANGUAGE_COOKIE_NAME } from '@/data'
import useCurrentPage from '@/hooks/use-current-page'
import Link from '@/components/Link/Link'
import { setCookie } from '@/utils'

type FooterLanguageSwitcherProps = {
  className?: string
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const FooterLanguageSwitcher = ({ className }: FooterLanguageSwitcherProps) => {
  const { currentLanguage, currentSlug, currentDocType } = useCurrentPage()

  return (
    <div className={classnames(styles.FooterLanguageSwitcher, className)}>
      {Object.values(LANGUAGES).map((language, i) => {
        return (
          <Link
            key={`${language}_${i}`}
            onClick={() => {
              setCookie({ name: LANGUAGE_COOKIE_NAME, value: language, maxAge: LANGUAGE_COOKIE_EXPIRY_SECONDS })
            }}
            link={
              {
                label: `${capitalizeFirstLetter(language)}`,
                linkType: 'internal',
                link: {
                  _type: currentDocType,
                  slug: currentSlug !== DEFAULT_LANGUAGE ? currentSlug : '',
                },
              } as SanityLink
            }
            language={language}
            className={classnames(styles.link, { [styles.isActive]: currentLanguage === language })}
          />
        )
      })}
    </div>
  )
}

FooterLanguageSwitcher.displayName = 'FooterLanguageSwitcher'

export default FooterLanguageSwitcher
