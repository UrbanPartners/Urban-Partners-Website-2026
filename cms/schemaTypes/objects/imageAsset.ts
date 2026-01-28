import {Asset} from 'sanity'

export default {
  title: 'Image Asset',
  name: 'imageAsset',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    {
      title: 'Alt text',
      name: 'alt',
      type: 'string',
    },
  ],
  preview: {
    select: {
      asset: 'asset',
      alt: 'alt',
    },
    prepare({asset, alt}: {asset: Asset; alt?: string}) {
      return {
        title: alt || '(alt text missing)',
        media: asset,
      }
    },
  },
}
