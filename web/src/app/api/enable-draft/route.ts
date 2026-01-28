// route handler enabling draft mode
import { draftMode } from 'next/headers'

export async function GET(_: Request) {
  if (!process.env.SANITY_PREVIEW_TOKEN) {
    return new Response('No sanity preview token supplied', { status: 401 })
  }
  const _draftMode = await draftMode()
  await _draftMode.enable()
  return new Response('Draft mode is enabled')
}
