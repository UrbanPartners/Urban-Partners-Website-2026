import { ImageResponse } from 'next/og'
import styles from '@/styles/modules/favicon.module.scss'
import { draftMode } from 'next/headers'
import { getSiteSettings } from '@/data/sanity'
import { getImageUrl } from '@/components/SanityImage/SanityImage.helper'
import { DEFAULT_LANGUAGE } from '@/data'

const imageFormat = 'png'
export const FAVICON_SIZES = [16, 32, 96, 180, 512]
const APPLE_TOUCH_SIZES = [57, 60, 72, 76, 114, 120, 144, 152, 180, 192]
const SIZES = [...FAVICON_SIZES, ...APPLE_TOUCH_SIZES]

// export const runtime = 'edge'
export const contentType = `image/${imageFormat}`

export const _generateImageMetadata = () => {
  return SIZES.map(size => ({
    contentType: contentType,
    size: { width: size, height: size },
    id: `${size}`,
  }))
}

export const generateIcon = async (id: string) => {
  const asNumber = parseInt(id)
  const size = SIZES[SIZES.indexOf(asNumber)]
  const { isEnabled } = await draftMode()
  const siteSettings = await getSiteSettings({ isPreview: isEnabled, language: DEFAULT_LANGUAGE })

  if (!siteSettings || !siteSettings?.metadata?.favicon) return null

  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={
          getImageUrl(siteSettings?.metadata?.favicon, {
            width: size,
            height: size,
            format: imageFormat,
          }) || ''
        }
        width={size}
        height={size}
        className={styles.image}
        alt=""
      />
    ),
    {
      width: size,
      height: size,
    },
  )
}

export function generateImageMetadata() {
  return _generateImageMetadata()
}

// Image generation
const Icon = async ({ id }: { id: string }) => {
  const iconData = await generateIcon(id)
  return iconData
}

export default Icon
