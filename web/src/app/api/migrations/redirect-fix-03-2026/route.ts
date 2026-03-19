import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const migrationClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false,
  token: process.env.SANITY_MIGRATION_TOKEN,
})

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Not allowed' }, { status: 403 })
  }

  const redirects = await migrationClient.fetch('*[_type == "redirect"] { _id, destination }')
  const domainsToRemove = ['https://urban.partners', 'https://urban-partners']
  const nonRelativeDestinations: Record<string, number> = {}

  for (const redirect of redirects) {
    const { destination } = redirect
    if (typeof destination === 'string' && !destination.startsWith('/')) {
      nonRelativeDestinations[destination] = (nonRelativeDestinations[destination] ?? 0) + 1
    }
  }

  const httpsDestinations: Record<string, number> = {}

  for (const [key, count] of Object.entries(nonRelativeDestinations)) {
    if (key.includes('https')) {
      try {
        const { origin } = new URL(key)
        httpsDestinations[origin] = (httpsDestinations[origin] ?? 0) + count
      } catch {
        httpsDestinations[key] = (httpsDestinations[key] ?? 0) + count
      }
    }
  }

  const dryRun: { _id: string; before: string; after: string }[] = []

  for (const redirect of redirects) {
    const { _id, destination } = redirect
    if (typeof destination !== 'string') continue

    const matchedDomain = domainsToRemove.find(domain => destination.includes(domain))
    if (!matchedDomain) continue

    const stripped = destination.replace(matchedDomain, '')
    const after = stripped.startsWith('/') ? stripped : `/${stripped}`
    dryRun.push({ _id, before: destination, after })
  }

  const transaction = migrationClient.transaction()

  for (const { _id, after } of dryRun) {
    transaction.patch(_id, patch => patch.set({ destination: after }))
  }

  // await transaction.commit({ dryRun: true })
  await transaction.commit()

  return NextResponse.json({ dryRun }, { status: 200 })
}
