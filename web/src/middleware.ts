import {
  DEFAULT_LANGUAGE,
  HOME_SLUG,
  LANGUAGES,
  // PRELOADER_COOKIE_NAME,
  LANGUAGE_COOKIE_NAME,
} from '@/data'
import { NextResponse } from 'next/server'
import {
  NextRequest,
  // userAgent
} from 'next/server'

const LANGUAGES_AS_ARRAY = Object.values(LANGUAGES)

export const config = {
  matcher: ['/((?!_next|api/|auth/|email/).*)'],
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getBrowserLanguage = (req: NextRequest) => {
  let languageHeaderString = req.headers.get('accept-language') || ''

  // Danish fix
  languageHeaderString = languageHeaderString.replace('da', LANGUAGES.DK)

  // Norwegian fix
  languageHeaderString = languageHeaderString.replace('nn', LANGUAGES.NO)

  const preferredLanguage = languageHeaderString
    ?.split(',')
    .map(i => {
      i = i.toLocaleLowerCase()
      return i.split(';')
    })
    ?.reduce((ac: { code: string; priority: string }[], lang) => [...ac, { code: lang[0], priority: lang[1] }], [])
    ?.sort((a, b) => (a.priority > b.priority ? -1 : 1))
    ?.find(i => LANGUAGES_AS_ARRAY.includes(i.code.substring(0, 2)))
    ?.code?.substring(0, 2)

  return preferredLanguage
}

// Get the preferred locale, similar to the above or using a library
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getLanguageFromPath(pathname: string) {
  const splitPath = pathname.split('/').filter(part => part)

  let language = null
  if (splitPath[0]) {
    const isLang = LANGUAGES_AS_ARRAY.includes(splitPath[0])
    if (isLang) {
      language = splitPath[0]
    }
  }

  return language
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPageRequest = !(
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/icon/') ||
    pathname.includes('.')
  )

  if (process.env.AUTH_ENABLED === 'true') {
    const url = request.nextUrl
    const allCookies = request.cookies.getAll()
    const authToken = allCookies.filter(cookie => cookie.name === 'auth-token')[0]
    const hasValidToken = authToken && authToken?.value === process.env.AUTH_PASSWORD
    // if auth token exists and is the password
    if (!hasValidToken) {
      // Redirect back to auth page if invalid
      url.pathname = '/auth/index.html'
      const response = NextResponse.rewrite(url)
      response.headers.set('Cache-Control', 'no-store')
      return response
    }
  }

  if (isPageRequest) {
    const allCookies = request.cookies.getAll()
    const languageCookie = allCookies.filter(cookie => cookie.name === LANGUAGE_COOKIE_NAME)[0]
    const languageCookieValue = languageCookie?.value || null
    const firstSegment = pathname.split('/')[1]
    const pathnameWithoutLanguage = LANGUAGES_AS_ARRAY.includes(firstSegment)
      ? pathname.replace(`/${firstSegment}`, '') || '/'
      : pathname
    const preferredLanguage = getBrowserLanguage(request)
    const newPath = `/${preferredLanguage ? preferredLanguage : LANGUAGES.EN}${pathnameWithoutLanguage}`

    // If no language cookie set and they have a preferred language,
    // set cookie to that language and redirect to proper language path
    if (!languageCookieValue && preferredLanguage !== DEFAULT_LANGUAGE) {
      const url = request.nextUrl.clone()
      url.pathname = newPath
      const res = NextResponse.redirect(url, { status: 302 })
      res.cookies.set(LANGUAGE_COOKIE_NAME, preferredLanguage ?? LANGUAGES.EN)
      return res
    }

    // REWRITE to default language homepage (ie / to /en)
    if (pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = `/${HOME_SLUG}`
      const res = NextResponse.rewrite(url)
      return res
    }

    // Redirect all default-language pages to the root (ie /en/about to /about)
    if (pathname.includes(`/${DEFAULT_LANGUAGE}/`)) {
      const url = request.nextUrl.clone()
      url.pathname = pathname.replace(`/${DEFAULT_LANGUAGE}`, '')
      const res = NextResponse.redirect(url, { status: 301 })
      return res
    }

    // Redirect the default language path to the root (ie /en to /)
    if (pathname === `/${DEFAULT_LANGUAGE}`) {
      const url = request.nextUrl.clone()
      url.pathname = '/'

      const res = NextResponse.redirect(url, { status: 301 })
      return res
    }
  }

  const response = NextResponse.next()
  // response.headers.set('Cache-Control', 'max-age=604800, stale-while-revalidate=86400')
  return response
}
