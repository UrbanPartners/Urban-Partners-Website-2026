import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'
import {getImageValidation, getRequiredImageDimensionsValidation} from '../../utils'
import {DEFAULT_LANGUAGE} from '../../data/languages'

export default {
  name: 'imageBlocks',
  title: 'Image Blocks',
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
        cmsTitle: 'Image Blocks',
      },
    },
    {
      name: 'image1',
      title: 'Image 1',
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
      name: 'image2',
      title: 'Image 2',
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
          items: ['link', 'strong'],
        }),
      ],
    },
    {
      name: 'flippedPosition',
      title: 'Flipped Position',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
    },
    prepare(selection: any) {
      const {cmsSettings} = selection
      const title = cmsSettings?.cmsTitle || 'Image Blocks'

      return {
        title,
      }
    },
  },
}
