import { LANGUAGES } from '@/data'

// prettier-ignore
const I18N_ENGLISH = {
  // Blog
  postedBy: 'Posted by #{author}',
  readingTime: '#{readingTimeMinutes} min read',
  caseStudy: 'Case Study',
  readArticle: 'Read Article',
  numberOfArticles: '#{count} articles',
  resultsForTerm: 'Results for "#{term}"',
  resultsForCategory: 'Category: #{category}',
  resultsForReference: 'Referenced by #{reference}',

  // Case study
  location: 'Location',
  country: 'Country',
  transactionYear: 'Transaction Year',
  sector: 'Sector',
  fund: 'Fund',
  size: 'Size (m²)',

  // Video
  playVideo: 'Play Video',
  pauseVideo: 'Pause Video',
}

const I18N_DK = {}
const I18N_SE = {}
const I18N_DE = {}
const I18N_FI = {}
const I18N_PL = {}
const I18N_NO = {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLangMerged = (langObject: any) => {
  return {
    ...I18N_ENGLISH,
    ...langObject,
  }
}

export const I18N_TEXT = {
  [LANGUAGES.EN]: I18N_ENGLISH,
  [LANGUAGES.DK]: getLangMerged(I18N_DK),
  [LANGUAGES.SE]: getLangMerged(I18N_SE),
  [LANGUAGES.DE]: getLangMerged(I18N_DE),
  [LANGUAGES.FI]: getLangMerged(I18N_FI),
  [LANGUAGES.PL]: getLangMerged(I18N_PL),
  [LANGUAGES.NO]: getLangMerged(I18N_NO),
}
