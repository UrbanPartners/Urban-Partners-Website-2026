import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { DOC_TYPES, DEFAULT_LANGUAGE, PAGINATION_ITEMS_PER_PAGE } from '@/data'
import { cardFields } from '../_shared'

export const getNewsListItemsQueryLine = (languageVariable: string) => groq`
  _type == "${DOC_TYPES.BLOG_POST}" && ${languageVariable} in isEnabled && !blogPostData.${DEFAULT_LANGUAGE}BlogPostData.disableFromNewsFeed
  `

export const NEWS_LIST_ITEMS_ORDER_LINE = groq`
blogPostData.${DEFAULT_LANGUAGE}BlogPostData.publishedDate desc
`

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  "variant": coalesce(variant, "a"),
  title,
  "offsetPosts": coalesce(offsetPosts, false),
  "totalItems": count(*[${getNewsListItemsQueryLine('$language')}]),
  "items": *[${getNewsListItemsQueryLine('$language')}] | order(${NEWS_LIST_ITEMS_ORDER_LINE}) {
    ${cardFields}
  }[0...${PAGINATION_ITEMS_PER_PAGE * 2}]
`

export const fragment = (name = 'newsList') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
