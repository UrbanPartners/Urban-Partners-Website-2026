import {Rule} from 'sanity'
import {getRequiredImageDimensionsValidation} from '../../utils'

export default {
  name: 'featuredArticle',
  title: 'Featured Article',
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
        cmsTitle: 'Featured Article',
      },
    },
    {
      name: 'variant',
      title: 'Variant',
      description:
        'Variant A is the larger/hero type, and variant B is more of a callout/block type.',
      type: 'string',
      initialValue: 'a',
      validation: (Rule: Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Variant A', value: 'a'},
          {title: 'Variant B', value: 'b'},
        ],
        layout: 'radio',
      },
    },
    {
      name: 'linksTo',
      title: 'Links To',
      type: 'linkNoDisabledNoLabel',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'text',
      rows: 2,
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'imageAsset',
      description: 'Image should be at least 2500px in width.',
      validation: (Rule: Rule) =>
        getRequiredImageDimensionsValidation({
          Rule,
          required: true,
          minWidth: 2500,
        }),
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
      variant: 'variant',
    },
    prepare(selection: any) {
      const {cmsSettings, variant} = selection
      const title = `${cmsSettings?.cmsTitle} ${variant ? `(Variant ${variant.toUpperCase()})` : ''}`

      return {
        title,
      }
    },
  },
}
