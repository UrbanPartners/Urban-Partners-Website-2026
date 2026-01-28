import {getRichTextFields} from '../../utils/richText'
import {Rule} from 'sanity'

export default {
  name: 'numberAndText',
  title: 'Number and Text',
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
        cmsTitle: 'Number and Text',
      },
    },
    {
      name: 'number',
      title: 'Number',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        getRichTextFields({
          items: [],
        }),
      ],
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    },
    {
      name: 'subheadingDescription',
      title: 'Subheading Description',
      type: 'array',
      of: [
        getRichTextFields({
          items: ['link', 'strong'],
        }),
      ],
    },
    {
      name: 'cta',
      title: 'CTA',
      type: 'button',
      initialValue: {
        link: {
          linkType: 'disabled',
        },
      },
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
      number: 'number',
    },
    prepare(selection: any) {
      const {cmsSettings, number} = selection
      const title = cmsSettings?.cmsTitle || 'Number and Text'

      return {
        title: `${title}${number ? ` - ${number}` : ''}`,
      }
    },
  },
}
