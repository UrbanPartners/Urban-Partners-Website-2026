/* eslint-disable @typescript-eslint/no-explicit-any */
interface SanityBlockContentChildren {
  _key: string
  _type: string
  marks: any[]
  text?: string
  chilren?: Children[]
}

interface SanityBlockContent {
  _key: string
  _type: 'block'
  children: BlockContentChildren[]
  markDefs: any[]
  style: string
}

interface SanityContentBlockProps {
  content: BlockContent[]
  serializer?: Partial<PortableTextReactComponents>
}
