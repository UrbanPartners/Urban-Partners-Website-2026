import {Rule} from 'sanity'
import {getMediaAssetFields} from '../objects/mediaAsset'
import {getImageValidation} from '../../utils'

export default {
  name: 'bigMedia',
  title: 'Big Media',
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
        cmsTitle: 'Big Media',
      },
    },
    getMediaAssetFields({
      isRequired: true,
      description: 'Image must be at least 2500px wide',
      customValidation: (Rule: Rule) => {
        const validation = Rule.custom((value, context) => {
          if (value?.media?.length === 1 && value?.media[0]?._type === 'imageAsset') {
            return getImageValidation({
              image: value?.media[0],
              minWidth: 2500,
            })
          }
          return true
        })
        return validation
      },
    }),
    {
      name: 'size',
      type: 'string',
      initialValue: 'full',
      options: {
        list: [
          {title: 'Full', value: 'full'},
          {title: '3/4', value: '3/4'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'height',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Tall', value: 'tall'},
          {title: 'Custom Aspect Ratio', value: 'customAspectRatio'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'customAspectRatio',
      description: 'ie. "16:9"',
      type: 'string',
      hidden: (context: any) => {
        return context.parent.height !== 'customAspectRatio'
      },
      validation: (Rule: Rule) =>
        Rule.custom((value: any, context: any) => {
          if (context?.parent?.height !== 'customAspectRatio') return true
          if (!value) return 'Required'
          if (value.split(':').length !== 2) return 'Invalid aspect ratio. Example: "16:9"'
          return true
        }),
    },
    {
      name: 'position',
      type: 'string',
      initialValue: 'right',
      options: {
        list: [
          {title: 'Right', value: 'right'},
          {title: 'Left', value: 'left'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      hidden: (context: any) => {
        return context.parent.size === 'full'
      },
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
    },
    prepare(selection: any) {
      const {cmsSettings} = selection
      const title = cmsSettings?.cmsTitle || 'Big Media'

      return {
        title,
      }
    },
  },
}
