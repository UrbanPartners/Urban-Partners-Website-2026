import { NextRequest, NextResponse } from 'next/server'
import { groq } from 'next-sanity'
import { client } from '@/data/sanity'
import { DOC_TYPES, DEFAULT_LANGUAGE } from '@/data'
import { cardFields } from '@/data/sanity/fragments/_shared'

interface PaginatedBlogPostsBody {
  perPage: number
  offset: number
}

export async function POST(req: NextRequest) {
  try {
    const body: PaginatedBlogPostsBody = await req.json()
    const { perPage, offset } = body

    if (typeof perPage !== 'number' || typeof offset !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'perPage and offset must be numbers',
        },
        { status: 400 },
      )
    }

    if (perPage < 1 || offset < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'perPage must be >= 1 and offset must be >= 0',
        },
        { status: 400 },
      )
    }

    const endIndex = offset + perPage

    // Fetch paginated results
    const query = groq`
      *[_type == "${DOC_TYPES.BLOG_POST}" && !blogPostData.${DEFAULT_LANGUAGE}BlogPostData.disableFromNewsFeed] | order(blogPostData.${DEFAULT_LANGUAGE}BlogPostData.publishedDate desc) {
        ${cardFields}
      }[${offset}...${endIndex}]
    `

    const results = await client.fetch(query, { language: DEFAULT_LANGUAGE })

    return NextResponse.json({
      success: true,
      results: results || [],
    })
  } catch (err) {
    console.error('Error in paginatedBlogPosts API:', err)
    if (err instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
        },
        { status: 500 },
      )
    }
    return NextResponse.json(
      {
        success: false,
        error: 'An unknown error occurred',
      },
      { status: 500 },
    )
  }
}
