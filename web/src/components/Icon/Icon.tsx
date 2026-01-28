import { forwardRef } from 'react'
import ArrowDiagonal from '@/components/_svgs/ArrowDiagonal'
import ArrowDown from '@/components/_svgs/ArrowDown'
import ArrowRight from '@/components/_svgs/ArrowRight'
import CaretDown from '@/components/_svgs/CaretDown'
import CaretRight from '@/components/_svgs/CaretRight'
import Logo from '@/components/_svgs/Logo'
import LogoWithWordmark from '@/components/_svgs/LogoWithWordmark'
import MagnifyingGlass from '@/components/_svgs/MagnifyingGlass'
import Play from '@/components/_svgs/Play'
import Plus from '@/components/_svgs/Plus'
import QuoteOpening from '@/components/_svgs/QuoteOpening'
import X from '@/components/_svgs/X'
import Download from '@/components/_svgs/Download'
import Pause from '@/components/_svgs/Pause'
import Volume from '@/components/_svgs/Volume'
import VolumeMuted from '@/components/_svgs/VolumeMuted'

export const ICONS = {
  arrowDiagonal: ArrowDiagonal,
  arrowDown: ArrowDown,
  arrowRight: ArrowRight,
  caretDown: CaretDown,
  caretRight: CaretRight,
  logo: Logo,
  logoWithWordmark: LogoWithWordmark,
  magnifyingGlass: MagnifyingGlass,
  play: Play,
  plus: Plus,
  quoteOpening: QuoteOpening,
  x: X,
  download: Download,
  pause: Pause,
  volume: Volume,
  volumeMuted: VolumeMuted,
}

export interface IconProps {
  name: keyof typeof ICONS
  className?: string
}

const Icon = forwardRef<SVGSVGElement, IconProps>(({ name, className }, ref) => {
  const IconComponent = ICONS[name as keyof typeof ICONS]
  if (!IconComponent) return null

  return (
    <IconComponent
      ref={ref}
      className={className}
    />
  )
})

Icon.displayName = 'Icon'

export default Icon
