import {getRichTextFields} from '../../utils/richText'

export default {
  name: 'introText',
  title: 'Intro Text',
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
        cmsTitle: 'Intro Text',
      },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'text',
      rows: 2,
    },
    {
      name: 'description',
      type: 'array',
      of: [
        getRichTextFields({
          items: [],
        }),
      ],
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
    },
    prepare(selection: any) {
      const {cmsSettings} = selection
      const title = cmsSettings?.cmsTitle || 'Intro Text'

      return {
        title,
      }
    },
  },
}
