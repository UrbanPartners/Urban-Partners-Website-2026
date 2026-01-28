import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'

export default {
  name: 'infoTiles',
  title: 'Info Tiles',
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
        cmsTitle: 'Info Tiles',
      },
    },
    {
      name: 'tallerContent',
      title: 'Taller Content',
      description: 'If true, the content below the title will be taller',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (Rule: Rule) => Rule.required().min(1).max(16),
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
              name: 'titleSubheader',
              title: 'Title Subheader',
              type: 'string',
              description: 'grey text under main title',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'array',
              of: [
                getRichTextFields({
                  items: ['link', 'strong'],
                }),
              ],
            },
            {
              name: 'bottomLinks',
              title: 'Bottom Links',
              type: 'array',
              of: [
                {
                  type: 'link',
                },
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
      const title = cmsSettings?.cmsTitle || 'Info Tiles'

      return {
        title,
      }
    },
  },
}
