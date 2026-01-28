'use client'

import { forwardRef, useContext } from 'react'
// import NextLink from 'next/link'
import { Link as TransitionLink } from 'next-transition-router'
import classnames from 'classnames'
import { getUrlFromPageData } from '@/utils'
import styles from './Link.module.scss'
import useCurrentPage from '@/hooks/use-current-page'
import { ScrollContext } from '@/context/Scroll'
import { NAV_ID } from '@/components/Navigation/NavigationInner/NavigationInner'
import { DEFAULT_LANGUAGE } from '@/data'

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      children,
      link,
      onMouseEnter,
      onMouseLeave,
      linkOnly,
      ariaLabel,
      onClick,
      onFocus,
      disableOpenNewTab = false,
      language,
      activeClass,
    },
    ref,
  ) => {
    const { linkType, label, link: url, hash, navigationOffset } = link
    const { scroll } = useContext(ScrollContext)
    const { currentPath, currentLanguage } = useCurrentPage()
    const urlObject = url as SanityLinkInternal
    const slug = typeof url === 'object' ? url?.slug : ''
    const urlPath = getUrlFromPageData(urlObject?._type, slug)

    // Other pages with languages
    let path = `/${language ? language : currentLanguage}`
    if (path !== urlPath) {
      path = `/${language ? language : currentLanguage}${urlPath}`
    }

    // Default lang structuring
    if (path.startsWith(`/${DEFAULT_LANGUAGE}`)) {
      path = path.replace(`/${DEFAULT_LANGUAGE}`, '')
      path = `${urlPath}`
    }

    if (path === `/${DEFAULT_LANGUAGE}`) {
      path = '/'
    }

    if (linkType === 'disabled') {
      return null
    }

    if (typeof url !== 'string' && linkType === 'external') {
      return null
    }

    if (typeof url !== 'object' && linkType === 'internal') {
      return null
    }

    if (linkType === 'external' || linkType === 'file') {
      let target = disableOpenNewTab ? '_self' : '_blank'

      if (typeof url === 'string') {
        if (url.includes('mailto:') || url.includes('tel:')) {
          target = '_self'
        }
      }

      return (
        <a
          ref={ref}
          aria-label={ariaLabel}
          data-link={true}
          {...(ariaLabel && !label && !children && { name: ariaLabel })}
          href={typeof url === 'string' ? url : ''}
          className={classnames(className)}
          target={target}
          rel="noreferrer"
          onFocus={e => {
            if (onFocus) onFocus(e)
          }}
          onMouseEnter={() => {
            if (onMouseEnter) onMouseEnter()
          }}
          onMouseLeave={() => {
            if (onMouseLeave) onMouseLeave()
          }}
          onClick={e => {
            if (onClick) onClick(e)
          }}
        >
          {label && !children && !linkOnly && <span>{label}</span>}
          {children && children}
        </a>
      )
    } else if (linkType === 'internal' || linkType === 'videoPopout') {
      const goesToOtherPage = currentPath !== path
      const hasHashOnSamePage = !goesToOtherPage && hash
      const isPopoutVideo = linkType === 'videoPopout' && link.videoId && link.videoPopoutType
      const isActiveLink = !hasHashOnSamePage && currentPath === path

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const props: any = {
        'aria-label': ariaLabel,
        'data-active-link': isActiveLink,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onFocus: (e: any) => {
          if (onFocus) onFocus(e)
        },
        ref: ref,
        className: classnames(
          className,
          { [styles.hashLink]: hasHashOnSamePage },
          {
            [styles.inactive]: isActiveLink,
          },
          {
            [activeClass || '']: activeClass && isActiveLink,
          },
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick: (e: any) => {
          if (onClick) onClick(e)

          if (hash) {
            if (hasHashOnSamePage) {
              e.preventDefault()
            }

            const goToElement = () => {
              const id = document.getElementById(hash)

              let offset = 0
              const navElement = document.getElementById(NAV_ID)
              if (navElement && navigationOffset) {
                offset = (navElement?.offsetHeight + 20) * -1
              }

              if (id && scroll) {
                scroll.scrollTo(id, {
                  duration: 0.3,
                  offset,
                })
              }
            }

            setTimeout(
              () => {
                goToElement()
              },
              hasHashOnSamePage ? 0 : 400,
            )
          }
        },
        onMouseEnter: () => {
          if (onMouseEnter) onMouseEnter()
        },
        onMouseLeave: () => {
          if (onMouseLeave) onMouseLeave()
        },
      }

      if (hasHashOnSamePage || isPopoutVideo) {
        return (
          <span {...props}>
            {label && !children && <span>{label}</span>}
            {children && children}
          </span>
        )
      }

      props.scroll = false
      props.href = `${path}${hash ? `#${hash}` : ''}`
      props['data-link'] = true

      return (
        <TransitionLink {...props}>
          {label && !children && <span>{label}</span>}
          {children && children}
        </TransitionLink>
      )
    }
  },
)

Link.displayName = 'Link'

export default Link
