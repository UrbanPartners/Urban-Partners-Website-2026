import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'
import {getRequiredImageDimensionsValidation} from '../../utils'

export default {
  name: 'pagePromo',
  title: 'Page Promo',
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
        cmsTitle: 'Page Promo',
      },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
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
      name: 'image',
      title: 'Image',
      type: 'imageAsset',
      description: 'Image should be at least 1500px in width.',
      validation: (Rule: Rule) =>
        getRequiredImageDimensionsValidation({
          Rule,
          minWidth: 1500,
          required: true,
        }),
    },
    {
      name: 'cta',
      title: 'CTA',
      type: 'button',
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
    },
    prepare(selection: any) {
      const {cmsSettings} = selection
      const title = cmsSettings?.cmsTitle || 'Page Promo'

      return {
        title,
      }
    },
  },
}
