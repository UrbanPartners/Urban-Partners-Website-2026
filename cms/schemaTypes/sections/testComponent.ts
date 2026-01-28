import {Rule} from 'sanity'
import {getRequiredImageDimensionsValidation} from '../../utils'

export default {
  name: 'testComponent',
  title: 'Test Component',
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
        cmsTitle: 'Test Component',
      },
    },
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Description',
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'CTA',
      name: 'cta',
      type: 'link',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Image',
      name: 'image',
      type: 'imageAsset',
      description: 'Required size: 2500x2500',
      validation: (Rule: Rule) =>
        getRequiredImageDimensionsValidation({width: 2500, height: 2500, Rule, required: true}),
    },
    {
      title: 'Media',
      name: 'media',
      type: 'mediaAsset',
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
    },
    prepare(selection: any) {
      const {cmsSettings} = selection
      const title = cmsSettings?.cmsTitle || 'Test Component'

      return {
        title,
      }
    },
  },
}
