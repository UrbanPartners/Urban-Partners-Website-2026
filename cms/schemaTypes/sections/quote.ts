import {getRichTextFields} from '../../utils/richText'

export default {
  name: 'quote',
  title: 'Quote',
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
        cmsTitle: 'Quote',
      },
    },
    {
      name: 'content',
      type: 'array',
      of: [
        getRichTextFields({
          items: [],
        }),
      ],
    },
    {
      name: 'authorImage',
      title: 'Author Image',
      type: 'imageAsset',
    },
    {
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'authorDesignation',
      title: 'Author Designation',
      type: 'string',
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
    },
    prepare(selection: any) {
      const {cmsSettings} = selection
      const title = cmsSettings?.cmsTitle || 'Quote'

      return {
        title,
      }
    },
  },
}
