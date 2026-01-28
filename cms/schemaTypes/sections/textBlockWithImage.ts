import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'

export default {
  name: 'textBlockWithImage',
  title: 'Text Block with Image',
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
        cmsTitle: 'Text Block with Image',
      },
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
      name: 'subheader',
      title: 'Subheader',
      type: 'string',
    },
    {
      name: 'bottomText',
      title: 'Bottom Text',
      type: 'array',
      of: [
        getRichTextFields({
          items: ['link', 'strong'],
        }),
      ],
    },
    {
      name: 'image',
      title: 'Image',
      type: 'imageAsset',
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
    },
    prepare(selection: any) {
      const {cmsSettings} = selection
      const title = cmsSettings?.cmsTitle || 'Text Block with Image'

      return {
        title,
      }
    },
  },
}
