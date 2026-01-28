import {getRichTextFields} from '../../utils/richText'

export default {
  name: 'richTextSection',
  title: 'Rich Text Section',
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
        cmsTitle: 'Rich Text Section',
      },
    },
    {
      name: 'content',
      type: 'array',
      of: [
        getRichTextFields({
          items: [
            'link',
            'strong',
            'italic',
            'heading1',
            'heading2',
            'heading3',
            'bullet',
            'numberedList',
          ],
        }),
        {
          type: 'richTextBlockquote',
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
      const title = cmsSettings?.cmsTitle || 'Rich Text Section'

      return {
        title,
      }
    },
  },
}
