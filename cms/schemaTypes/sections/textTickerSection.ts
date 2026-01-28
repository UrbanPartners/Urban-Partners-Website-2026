import {Rule} from 'sanity'

export default {
  name: 'textTickerSection',
  title: 'Text Ticker Section',
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
        cmsTitle: 'Text Ticker Section',
      },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'rows',
      title: 'Rows',
      type: 'array',
      validation: (Rule: Rule) => Rule.required().min(1).max(3),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'items',
              title: 'Items',
              type: 'array',
              validation: (Rule: Rule) => Rule.required().min(2).max(8),
              of: [{type: 'string', validation: (Rule: Rule) => Rule.required().min(1).max(50)}],
            },
          ],
          preview: {
            select: {
              items: 'items',
            },
            prepare(selection: any) {
              const {items} = selection
              return {
                title: items?.length ? `${items.length} items` : 'Row',
                subtitle: items?.join(', '),
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
      title: 'title',
    },
    prepare(selection: any) {
      const {cmsSettings, title} = selection
      const cmsTitle = cmsSettings?.cmsTitle || 'Text Ticker Section'

      return {
        title: `${cmsTitle}${title ? ` - ${title}` : ''}`,
      }
    },
  },
}
