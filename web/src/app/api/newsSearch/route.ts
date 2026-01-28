import { NextRequest, NextResponse } from 'next/server'
import { groq } from 'next-sanity'
import { client } from '@/data/sanity'
import { DOC_TYPES, DEFAULT_LANGUAGE } from '@/data'
import { cardFields } from '@/data/sanity/fragments/_shared'

interface NewsSearchBody {
  searchTerm?: string
  blogCategory?: string
  blogReference?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: NewsSearchBody = await req.json()
    const { searchTerm, blogCategory: blogCategoryId, blogReference: blogReferenceId } = body

    // Build the GROQ query with conditional filters
    const filters: string[] = [`_type == "${DOC_TYPES.BLOG_POST}"`]

    // Add search term filter if provided
    if (searchTerm && searchTerm.trim()) {
      // Search in title and summary (using language-specific fields)
      const searchTermEscaped = searchTerm.replace(/"/g, '\\"')
      filters.push(
        `(
          ${DEFAULT_LANGUAGE}Title match "*${searchTermEscaped}*" ||
          defined(blogPostData.${DEFAULT_LANGUAGE}BlogPostData.summary) && blogPostData.${DEFAULT_LANGUAGE}BlogPostData.summary match "*${searchTermEscaped}*"
        )`,
      )
    }

    // Add blog category filter if provided
    if (blogCategoryId && blogCategoryId.trim()) {
      filters.push(`"${blogCategoryId}" in blogPostData.${DEFAULT_LANGUAGE}BlogPostData.blogCategories[]._ref`)
    }

    // Add blog reference filter if provided
    if (blogReferenceId && blogReferenceId.trim()) {
      filters.push(`"${blogReferenceId}" in blogPostData.${DEFAULT_LANGUAGE}BlogPostData.blogReferences[]._ref`)
    }

    const filterString = filters.join(' && ')

    const query = groq`
      *[${filterString}] | order(blogPostData.${DEFAULT_LANGUAGE}BlogPostData.publishedDate desc) {
        ${cardFields}
      }[0..7]
    `

    const results = await client.fetch(query, { language: DEFAULT_LANGUAGE })

    return NextResponse.json({
      success: true,
      results,
      count: results?.length || 0,
    })
  } catch (err) {
    console.error('Error in newsSearch API:', err)
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
