import { DOC_TYPES, HOME_SLUG, LANGUAGES } from '@/data'
import { getAllPagesForAllLanguages } from '@/data/sanity'
import { getUrlFromPageData } from '@/utils'

const sitemap = async () => {
  const pagesData: SanityPageWithLanguage[] = (await getAllPagesForAllLanguages(DOC_TYPES.PAGE, false, true)) || []
  const caseStudiesData: SanityPageWithLanguage[] =
    (await getAllPagesForAllLanguages(DOC_TYPES.CASE_STUDY, false, true)) || []
  const blogPostsData: SanityPageWithLanguage[] =
    (await getAllPagesForAllLanguages(DOC_TYPES.BLOG_POST, false, true)) || []

  const allData = [...pagesData, ...caseStudiesData, ...blogPostsData]

  const home = pagesData.find(page => page.slug.current === HOME_SLUG)
  let homePages: { url: string; lastModified: string }[] = []
  if (home) {
    homePages = Object.values(LANGUAGES).map(language => {
      return {
        url: `/${language}`,
        lastModified: home._updatedAt,
      }
    })
  }

  const allUrls = []

  const allUrlsExceptHome = allData
    .filter(page => {
      return page?.metadata?.allowCrawlers && page.isEnabled
    })
    .map(page => {
      if (page.slug.current === HOME_SLUG) return null

      let url = ''
      const lastModified = page._updatedAt

      if (!page || !page?.slug?.current) return null

      switch (page._type) {
        case DOC_TYPES.PAGE:
          url = getUrlFromPageData(DOC_TYPES.PAGE, page.slug.current)

          break
        case DOC_TYPES.BLOG_POST:
          url = getUrlFromPageData(DOC_TYPES.BLOG_POST, page.slug.current)
          break
        case DOC_TYPES.CASE_STUDY:
          url = getUrlFromPageData(DOC_TYPES.CASE_STUDY, page.slug.current)
          break
        default:
          break
      }

      const urlWithLang = `${process.env.NEXT_PUBLIC_SITE_URL}/${page.language}${url}`

      return {
        url: urlWithLang,
        lastModified,
      }
    })
    .filter(Boolean)

  allUrls.push(...homePages)
  allUrls.push(...allUrlsExceptHome)

  // Remove duplicates based on URL, keeping the most recently modified version
  const uniqueUrls = new Map()
  allUrls.forEach(item => {
    if (!item) return
    const existingItem = uniqueUrls.get(item.url)
    if (!existingItem) {
      uniqueUrls.set(item.url, item)
    }
  })

  return Array.from(uniqueUrls.values())
}

export default sitemap
