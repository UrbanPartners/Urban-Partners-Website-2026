import {getRichTextFields} from '../../utils/richText'
import {Rule} from 'sanity'

export default {
  name: 'gridContent',
  title: 'Grid Content',
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
        cmsTitle: 'Grid Content',
      },
    },
    {
      name: 'firstRowColumns',
      title: 'First Row Columns',
      type: 'number',
      initialValue: 2,
      validation: (Rule: Rule) => Rule.required().min(2).max(3),
      options: {
        list: [
          {title: '2 Columns', value: 2},
          {title: '3 Columns', value: 3},
        ],
        layout: 'radio',
      },
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (Rule: Rule) => Rule.required().min(2).max(11),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [
                getRichTextFields({
                  items: ['heading3', 'strong', 'link'],
                }),
              ],
            },
          ],
          preview: {
            select: {
              content: 'content',
            },
            prepare(selection: any) {
              const {content} = selection
              const firstBlock = content?.find((block: any) => block._type === 'block')
              const text = firstBlock?.children?.map((child: any) => child.text).join('') || ''
              const preview = text.slice(0, 50) + (text.length > 50 ? '...' : '')

              return {
                title: preview || 'Grid Item',
              }
            },
          },
        },
      ],
    },
    {
      name: 'caption',
      type: 'string',
      description:
        'Shows up in first grid item on desktop, and at the end of the content on mobile',
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
      items: 'items',
    },
    prepare(selection: any) {
      const {cmsSettings, items} = selection
      const title = cmsSettings?.cmsTitle || 'Grid Content'
      const itemCount = items?.length || 0

      return {
        title: `${title}${itemCount ? ` (${itemCount} items)` : ''}`,
      }
    },
  },
}
