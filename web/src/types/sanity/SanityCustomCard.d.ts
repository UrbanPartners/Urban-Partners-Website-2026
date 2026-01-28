import { SanityImage } from './SanityImage'

type SanityCustomCard = {
  _key?: string
  _type: 'customCard'
  title: string
  description?: string
  image?: SanityImage
  link: SanityLink
}
