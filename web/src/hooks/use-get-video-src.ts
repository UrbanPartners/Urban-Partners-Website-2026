import useBreakpoint from '@/hooks/use-breakpoint'
import { bytesToMb } from '@/utils'
import { useEffect, useState } from 'react'

type useGetVideoSrcProps = {
  videoDesktop?: SanityVideoAsset
  videoMobile?: SanityVideoAsset
  desktopSizeMb: number
  mobileSizeMb: number
}

function useGetVideoSrc({ videoDesktop, videoMobile, desktopSizeMb, mobileSizeMb }: useGetVideoSrcProps) {
  const { isMobile } = useBreakpoint()
  const [videoSrc, setVideoSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!videoMobile || !videoDesktop) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let asset: any | null = isMobile ? videoMobile?.asset : videoDesktop?.asset
    let mobileTooLarge = false
    if (isMobile && bytesToMb(videoMobile?.asset?.size) > mobileSizeMb * 1.1) {
      mobileTooLarge = true
    }
    let desktopTooLarge = false
    if (!isMobile && bytesToMb(videoDesktop?.asset?.size) > desktopSizeMb * 1.1) {
      desktopTooLarge = true
    }

    if (process.env.NODE_ENV === 'development') {
      mobileTooLarge = false
      desktopTooLarge = false
    }

    if (desktopTooLarge) {
      console.warn(
        `Video asset for desktop is too large. Current size: ${bytesToMb(
          videoDesktop?.asset?.size,
        )} MB. Should be less than ${desktopSizeMb} MB.`,
      )
      asset = null
    }

    if (mobileTooLarge) {
      console.warn(
        `Video asset for mobile is too large. Current size: ${bytesToMb(
          videoDesktop?.asset?.size,
        )} MB. Should be less than ${mobileSizeMb} MB.`,
      )
      asset = null
    }

    setVideoSrc(asset?.url ? asset.url : null)
  }, [isMobile, videoDesktop, videoMobile, desktopSizeMb, mobileSizeMb])

  return { videoSrc }
}

export default useGetVideoSrc
