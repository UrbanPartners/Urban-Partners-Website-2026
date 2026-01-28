'use client'

import { DOC_TYPES, LANGUAGES, PRELOADER_COOKIE_NAME } from '@/data'
import useStore from '@/store'
import Cookies from 'js-cookie'
import { usePathname } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

const LANGUAGE_VALUES = Object.values(LANGUAGES)

const useCurrentPage = () => {
  const params = useParams()
  const paramsAsArray = Object.keys(params)
  const currentPath = usePathname()
  const currentLanguage = params.language
  const pageHistory = useStore(state => state.pageHistory)

  const hasViewedPreloader = useMemo(() => {
    return Boolean(Cookies.get(PRELOADER_COOKIE_NAME) === 'true')
  }, [])

  let currentDocType = DOC_TYPES.PAGE
  let currentSlug = params?.slug || ''

  if (Array.isArray(currentSlug)) {
    currentSlug = currentSlug.join('/')
  }

  if (currentPath.split('/').filter(item => item).length === 2 && params?.slug === undefined) {
    currentSlug = currentPath.split('/').filter(item => item)[1]
  } else if (paramsAsArray.includes('blogPostSlug')) {
    currentDocType = DOC_TYPES.BLOG_POST
    currentSlug = params.blogPostSlug as string
  }

  let isHome = false

  if (params?.slug) {
    if (LANGUAGE_VALUES.includes(params?.slug[0])) {
      isHome = true
    }
  } else {
    isHome = true
  }

  const isInitialLoadOnHome = Boolean(isHome && pageHistory?.length < 2)

  const shouldShowPreloader = !hasViewedPreloader && isInitialLoadOnHome

  const homeLink = {
    linkType: 'internal',
    link: {
      _type: DOC_TYPES.PAGE,
      slug: currentLanguage,
    } as SanityLinkInternal,
  } as SanityLink

  return {
    currentPath,
    currentLanguage,
    currentDocType,
    currentSlug,
    homeLink,
    params,
    isHome,
    pageHistory,
    isInitialLoadOnHome,
    shouldShowPreloader,
  }
}

useCurrentPage.displayName = 'useCurrentPage'

export default useCurrentPage
