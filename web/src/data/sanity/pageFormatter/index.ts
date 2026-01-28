import { DOC_TYPES } from '@/data'
import { blogPostFormatter } from './blogPost'
import { caseStudyFormatter } from './caseStudy'
import { genericFormatter } from './genericFormatter'

export const formatPage = (data: SanityPage, language?: string): SanityPage => {
  if (!data?.sections) {
    data.sections = []
  }

  data.sections = data.sections.filter(section => !section?.cmsSettings?.isHidden)

  switch (data._type) {
    case DOC_TYPES.BLOG_POST:
      data = blogPostFormatter(data)
      break
    case DOC_TYPES.CASE_STUDY:
      data = caseStudyFormatter(data, language)
      break
  }

  data = genericFormatter(data)

  return data
}
