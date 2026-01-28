import {Rule} from 'sanity'

export default {
  name: 'customCard',
  title: 'Custom Card',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    },
    {
      name: 'image',
      title: 'Image',
      type: 'imageAsset',
    },
    {
      name: 'link',
      title: 'Link',
      type: 'linkNoDisabledNoLabel',
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      image: 'image',
    },
    prepare({title, image}: {title?: string; image?: any}) {
      return {
        title: title || 'Custom Card',
        media: image,
      }
    },
  },
}
