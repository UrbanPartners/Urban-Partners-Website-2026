import { getMergedLanguageQueryString } from '@/data/sanity/utils'
import { groq } from 'next-sanity'
import person from './person'
import blogCategory from './blogCategory'
import imageAsset from '@/data/sanity/fragments/imageAsset'
import blogReference from '@/data/sanity/fragments/blogReference'

export const fields = groq`
  blogPostData {
    ${getMergedLanguageQueryString('BlogPostData', [
      'publishedDate',
      'summary',
      {
        name: 'blogCategories',
        dereference: true,
        isArray: true,
        fields: blogCategory.fields,
      },
      {
        name: 'blogReferences',
        dereference: true,
        isArray: true,
        fields: blogReference.fields,
      },
      {
        name: 'author',
        dereference: true,
        fields: person.fields,
      },
      {
        name: 'image',
        fields: imageAsset.fields,
      },
      'disableFromNewsFeed',
    ])}
  },
  
  
`

// "richTextContent": select(
//       ${Object.values(LANGUAGES)
//         .map(
//           lang =>
//             `$language == "${lang}" => coalesce(richTextContent.${lang}RichTextContent, richTextContent.${DEFAULT_LANGUAGE}RichTextContent),`,
//         )
//         .join('')}
//     )[]  {
//       ${getRichTextFields({})}
//     },

export const fragment = (name = 'blogPost') => `${name}{${fields}}`

const exported = {
  fields,
  fragment,
}

export default exported
