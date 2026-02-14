import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'
import {getMediaAssetFields} from '../objects/mediaAsset'
import {getImageValidation} from '../../utils'

export default {
  name: 'largeTitleHeroWithMedia',
  title: 'Large Title Hero with Media',
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
        cmsTitle: 'Large Title Hero with Media',
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
      validation: (Rule: Rule) => Rule.required(),
      initialValue: 'Overview',
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
    getMediaAssetFields({
      isRequired: false,
      typesAllowed: ['imageAsset', 'video'],
      description: 'Image should be at least 2500px in width.',
      customValidation: (Rule: Rule) => {
        const validation = Rule.custom((value, context) => {
          if (value?.media?.length === 1 && value?.media[0]?._type === 'imageAsset') {
            return getImageValidation({
              image: value?.media[0],
              required: true,
              minWidth: 2500,
            })
          }
          return true
        })
        return validation
      },
    }),
    {
      name: 'mediaSize',
      title: 'Media Size',
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
    },
    {
      name: 'mediaHeight',
      title: 'Media Height',
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Tall', value: 'tall'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    },
    {
      name: 'showArrow',
      title: 'Show Arrow',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
      title: 'title',
    },
    prepare(selection: any) {
      const {cmsSettings, title} = selection
      const cmsTitle = cmsSettings?.cmsTitle || 'Large Title Hero with Media'

      return {
        title: `${cmsTitle}${title ? ` - ${title}` : ''}`,
      }
    },
  },
}
