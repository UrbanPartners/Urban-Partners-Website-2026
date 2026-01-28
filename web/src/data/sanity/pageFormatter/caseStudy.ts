import { geti18nText } from '@/hooks/use-i18n'
import { getReadingTime, portableTextToText } from '@/utils'

const MIN_READING_TIME = 2

export const getReadingTimeFromPageSections = (sections: SectionsSchema | undefined) => {
  if (!sections || !sections?.length) return 0

  const readingTimes = sections.map(section => {
    if (section._type === 'richTextSection') {
      return getReadingTime(portableTextToText(section.content))
    }
    return 0
  })

  const totalReadingTime = readingTimes.reduce((acc, curr) => acc + curr, 0)

  return totalReadingTime || MIN_READING_TIME
}

export const caseStudyFormatter = (data: SanityPage, language?: string): SanityPage => {
  const sectionsAddedManually = data.sections || []

  const readingTime = getReadingTimeFromPageSections(data.sections)

  const topSections = []

  topSections.push({
    _type: 'blogPostHero',
    title: data.title,
    summary: data.caseStudyData?.summary,
    date: data.caseStudyData?.publishedDate,
    readingTime,
    isCaseStudy: true,
  })

  if (data.caseStudyData?.image) {
    topSections.push({
      _type: 'spacer',
      desktop: 'auto',
      mobile: 'auto',
    })

    topSections.push({
      _type: 'bigMedia',
      mediaAsset: data.caseStudyData?.image,
      size: 'full',
    })
  }

  topSections.push({
    _type: 'spacer',
    desktop: 'auto',
    mobile: 'auto',
  })

  if (
    data.caseStudyData?.location ||
    data.caseStudyData?.country ||
    data.caseStudyData?.transactionYear ||
    data.caseStudyData?.sector ||
    data.caseStudyData?.fund ||
    data.caseStudyData?.size
  ) {
    const factsItems = []

    if (data.caseStudyData?.location) {
      factsItems.push({
        title: geti18nText(language as string, 'location'),
        description: data.caseStudyData?.location,
      })
    }

    if (data.caseStudyData?.country) {
      factsItems.push({
        title: geti18nText(language as string, 'country'),
        description: data.caseStudyData?.country,
      })
    }

    if (data.caseStudyData?.transactionYear) {
      factsItems.push({
        title: geti18nText(language as string, 'transactionYear'),
        description: data.caseStudyData?.transactionYear,
      })
    }

    if (data.caseStudyData?.sector) {
      factsItems.push({
        title: geti18nText(language as string, 'sector'),
        description: data.caseStudyData?.sector,
      })
    }

    if (data.caseStudyData?.fund) {
      factsItems.push({
        title: geti18nText(language as string, 'fund'),
        description: data.caseStudyData?.fund,
      })
    }

    if (data.caseStudyData?.size) {
      factsItems.push({
        title: geti18nText(language as string, 'size'),
        description: data.caseStudyData?.size,
      })
    }

    topSections.push({
      _type: 'factList',
      title: 'Key Facts',
      description: data.caseStudyData?.factsDescription,
      items: factsItems,
    })
    topSections.push({
      _type: 'spacer',
      desktop: 'auto',
      mobile: 'auto',
    })
  }

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
