import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'

export default {
  name: 'peopleAccordion',
  title: 'People Accordion',
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
        cmsTitle: 'People Accordion',
      },
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (Rule: Rule) => Rule.required().min(1).max(8),
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
              of: [
                getRichTextFields({
                  items: ['link', 'strong'],
                }),
              ],
            },
            {
              name: 'people',
              title: 'People',
              type: 'array',
              validation: (Rule: Rule) => Rule.required().min(1).max(30),
              of: [
                {
                  type: 'reference',
                  to: [{type: 'person'}],
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
      const title = cmsSettings?.cmsTitle || 'People Accordion'

      return {
        title,
      }
    },
  },
}
