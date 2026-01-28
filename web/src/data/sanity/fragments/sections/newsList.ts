import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { DOC_TYPES, DEFAULT_LANGUAGE, PAGINATION_ITEMS_PER_PAGE } from '@/data'
import { cardFields } from '../_shared'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  "variant": coalesce(variant, "a"),
  title,
  "offsetPosts": coalesce(offsetPosts, false),
  "totalItems": count(*[_type == "${DOC_TYPES.BLOG_POST}"]),
  "items": *[_type == "${DOC_TYPES.BLOG_POST}" && !blogPostData.${DEFAULT_LANGUAGE}BlogPostData.disableFromNewsFeed] | order(blogPostData.${DEFAULT_LANGUAGE}BlogPostData.publishedDate desc) {
    ${cardFields}
  }[0...${PAGINATION_ITEMS_PER_PAGE * 2}]
`

export const fragment = (name = 'newsList') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
