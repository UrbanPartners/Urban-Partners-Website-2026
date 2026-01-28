type VideoLoopProps = {
  desktopLoop: SanityFileAsset
  mobileLoop: SanityFileAsset
  desktopSizeMb: number
  mobileSizeMb: number
  disableInView?: boolean
  className?: string
  videoIntervalCheckMs?: number
  videoShowDuration?: string
  id?: string
  initiallyStopped?: boolean
  coverTarget?: string | HTMLElement | null
  alt?: string
  onShow?: () => void
  onCanPlay?: () => void
  onLoadedMetadata?: () => void
}

type VideoLoopImperativeHandle = {
  getElement: () => HTMLElement | null
  playVideo: () => void
  stopVideo: () => void
  loadVideo: () => void
  forceIsPlaying: (value: boolean) => void
}
