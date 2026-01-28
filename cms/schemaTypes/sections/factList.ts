import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'

export const factsListDescriptionFields = getRichTextFields({
  items: ['link', 'strong'],
})

export default {
  name: 'factList',
  title: 'Fact List',
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
        cmsTitle: 'Fact List',
      },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      type: 'array',
      of: [factsListDescriptionFields],
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
              type: 'string',
              validation: (Rule: Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              description: 'description',
            },
            prepare({title, description}: {title: string; description: string}) {
              return {
                title: title || 'Untitled',
                subtitle: description,
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
      const title = cmsSettings?.cmsTitle || 'Fact List'

      return {
        title,
      }
    },
  },
}
