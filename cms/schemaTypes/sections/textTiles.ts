import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'

export default {
  name: 'textTiles',
  title: 'Text Tiles',
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
        cmsTitle: 'Text Tiles',
      },
    },
    {
      name: 'itemsPerRow',
      title: 'Items Per Row',
      type: 'string',
      initialValue: '4',
      validation: (Rule: Rule) => Rule.required(),
      options: {
        list: [
          {title: '4', value: '4'},
          {title: '3', value: '3'},
        ],
        layout: 'radio',
      },
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (Rule: Rule) => Rule.required().min(1).max(12),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'text',
              rows: 2,
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
          ],
          preview: {
            select: {
              title: 'title',
            },
            prepare(selection: any) {
              const {title} = selection
              return {
                title: title || 'Item',
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
      const title = cmsSettings?.cmsTitle || 'Text Tiles'

      return {
        title,
      }
    },
  },
}
