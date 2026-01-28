import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'
import {getMediaAssetFields} from '../objects/mediaAsset'
import {getImageValidation} from '../../utils'

export default {
  name: 'homeHero',
  title: 'Home Hero',
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
        cmsTitle: 'Home Hero',
      },
    },
    {
      name: 'title',
      title: 'Title (Desktop)',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().max(20),
    },
    {
      name: 'titleMobile',
      title: 'Title (Mobile)',
      type: 'text',
      rows: 3,
      validation: (Rule: Rule) => Rule.required().max(20),
    },
    getMediaAssetFields({
      name: 'media',
      isRequired: true,
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
      name: 'backgroundOverlay',
      title: 'Background Overlay',
      type: 'number',
      description: 'Overlay opacity from 0-100',
      initialValue: 0,
      validation: (Rule: Rule) => Rule.required().min(0).max(100),
    },
    {
      name: 'descriptionTitle',
      title: 'Description Title',
      type: 'array',
      of: [
        getRichTextFields({
          items: [],
        }),
      ],
    },
    {
      name: 'descriptionText',
      title: 'Description Text',
      type: 'array',
      of: [
        getRichTextFields({
          items: ['link', 'strong'],
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
      const title = cmsSettings?.cmsTitle || 'Home Hero'

      return {
        title,
      }
    },
  },
}
