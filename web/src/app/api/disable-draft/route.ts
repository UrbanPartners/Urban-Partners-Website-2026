import { draftMode } from 'next/headers'

export async function GET(_: Request) {
  const _draftMode = await draftMode()
  await _draftMode.disable()
  return new Response('Draft mode is disabled')
}
