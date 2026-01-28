import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'

export default {
  name: 'textBlocksWithImageSwapper',
  title: 'Text Blocks with Image Swapper',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    {
      name: 'cmsSettings',
      title: 'CMS Settings',
      type: 'cmsSettings',
      initialValue: {
        cmsTitle: 'Text Blocks with Image Swapper',
      },
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (Rule: Rule) => Rule.required().min(1).max(10),
      of: [
        {
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
              type: 'array',
              validation: (Rule: Rule) => Rule.required(),
              of: [
                getRichTextFields({
                  items: ['link', 'strong'],
                }),
              ],
            },
            {
              name: 'image',
              title: 'Image',
              type: 'imageAsset',
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
            prepare(selection: any) {
              const {title, media} = selection
              return {
                title: title || 'Item',
                media,
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
    },
    prepare(selection: any) {
      const {cmsSettings} = selection
      const title = cmsSettings?.cmsTitle || 'Text Blocks with Image Swapper'

      return {
        title,
      }
    },
  },
}
