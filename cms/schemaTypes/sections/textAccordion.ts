import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'

export default {
  name: 'textAccordion',
  title: 'Text Accordion',
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
        cmsTitle: 'Text Accordion',
      },
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
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
                  items: [],
                }),
              ],
            },
            {
              name: 'itemList',
              title: 'Item List',
              type: 'itemList',
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
      const title = cmsSettings?.cmsTitle || 'Text Accordion'

      return {
        title,
      }
    },
  },
}
