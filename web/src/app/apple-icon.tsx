import { _generateImageMetadata, generateIcon } from '@/app/icon'

// export const runtime = 'edge'
export const contentType = 'image/png'

export function generateImageMetadata() {
  return _generateImageMetadata()
}

// Image generation
const Icon = async ({ id }: { id: string }) => {
  const iconData = await generateIcon(id)

  return iconData
}

export default Icon
