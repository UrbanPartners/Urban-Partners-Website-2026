import { getReadingTimeFromPageSections } from '@/data/sanity/pageFormatter/caseStudy'

export const blogPostFormatter = (data: SanityPage): SanityPage => {
  const sectionsAddedManually = data.sections || []

  // add author to last section block of type richTextSection
  if (data.blogPostData?.author && sectionsAddedManually?.length > 0) {
    const lastRichTextSectionIndex = sectionsAddedManually.findLastIndex(section => section._type === 'richTextSection')
    const lastRichTextSection = sectionsAddedManually[lastRichTextSectionIndex]
    if (lastRichTextSection) {
      lastRichTextSection.author = data.blogPostData?.author
    }
  }

  const readingTime = getReadingTimeFromPageSections(data.sections)

  const topSections = []

  topSections.push({
    _type: 'blogPostHero',
    title: data.title,
    summary: data.blogPostData?.summary,
    blogCategories: data.blogPostData?.blogCategories || [],
    author: data.blogPostData?.author,
    date: data.blogPostData?.publishedDate,
    readingTime,
  })

  if (data.blogPostData?.image) {
    topSections.push({
      _type: 'spacer',
      desktop: 'auto',
      mobile: 'auto',
    })

    topSections.push({
      _type: 'bigMedia',
      mediaAsset: data.blogPostData?.image,
      size: 'full',
    })
  }

  topSections.push({
    _type: 'spacer',
    desktop: 'auto',
    mobile: 'auto',
  })

  const sectionsWithSpacing = sectionsAddedManually
    .map(section => {
      if (section._type === 'quote' || section._type === 'introText') {
        return [
          section,
          {
            _type: 'spacer',
            desktop: 255,
            mobile: 100,
          },
        ]
      }

      return [
        section,
        {
          _type: 'spacer',
          desktop: 'auto',
          mobile: 'auto',
        },
      ]
    })
    .flat()

  data.sections = [...topSections, ...sectionsWithSpacing]

  return data
}
