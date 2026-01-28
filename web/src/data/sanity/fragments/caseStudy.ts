import { getMergedLanguageQueryString, getRichTextFields } from '@/data/sanity/utils'
import { groq } from 'next-sanity'
import imageAsset from '@/data/sanity/fragments/imageAsset'

export const fields = groq`
  caseStudyData {
    ${getMergedLanguageQueryString('CaseStudyData', [
      'publishedDate',
      'summary',
      {
        name: 'image',
        fields: imageAsset.fields,
      },
      {
        name: 'factsDescription',
        fields: getRichTextFields({}),
        isArray: true,
      },
      'location',
      'country',
      'transactionYear',
      'sector',
      'fund',
      'size',
    ])}
  },
`

export const fragment = (name = 'caseStudy') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
