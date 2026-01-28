import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { client } from '@/data/sanity'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { revalidateTag } from 'next/cache'
import { getUrlFromPageData } from '@/utils'
import { DOC_TYPES, HOME_SLUG, LANGUAGES, SANITY_EVERYTHING_TAG } from '@/data'

export const config = {
  api: {
    bodyParser: false, // required to access the raw stream
  },
}

export async function OPTIONS(_: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    },
  )
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) || ''
  const sanitySecret = process.env.SANITY_WEBHOOK_SECRET || ''
  const requestData = await req.text()
  const isValidFromSanity = await isValidSignature(requestData, signature, sanitySecret)
  const isValidOtherRequest = req.headers.get('Authorization') === `Bearer ${process.env.SANITY_WEBHOOK_SECRET}`

  if (process.env.NODE_ENV === 'production') {
    if (!isValidOtherRequest && !isValidFromSanity) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const allDocuments = await client.fetch(`
      *[_type == "${DOC_TYPES.PAGE}" || _type == "${DOC_TYPES.BLOG_POST}" || _type == "${DOC_TYPES.CASE_STUDY}"] {
        slug,
        _type
      }
    `)

    // Revalidate Tag
    revalidateTag(SANITY_EVERYTHING_TAG)

    // Get all paths to revalidate
    const pathsToRevalidate = []

    for (const doc of allDocuments) {
      const url = getUrlFromPageData(doc._type, doc.slug.current)
      pathsToRevalidate.push(url)

      for (const language of Object.values(LANGUAGES)) {
        const urlWithLanguage = `/${language}${url}`
        pathsToRevalidate.push(urlWithLanguage)
      }
    }

    const pathsRevalidated = Array.from(new Set(pathsToRevalidate))

    // Revalidate home page + homepage for each language
    revalidatePath('/')
    revalidatePath(`/${HOME_SLUG}`)

    for (const language of Object.values(LANGUAGES)) {
      revalidatePath(`/${language}`)
      revalidatePath(`/${language}/${HOME_SLUG}`)
    }

    for (const path of pathsRevalidated) {
      revalidatePath(path)
    }

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Revalidated everything')
    }

    const response = {
      pathsRevalidated,
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Failed to revaliate:', error)
  }
}
