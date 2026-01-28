import {getRichTextFields} from '../../utils/richText'
import {Rule} from 'sanity'
import {getMediaAssetFields} from '../objects/mediaAsset'
import {getImageValidation} from '../../utils'

export default {
  name: 'expandingImageAndContent',
  title: 'Expanding Image and Content',
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
        cmsTitle: 'Expanding Image and Content',
      },
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule: Rule) => Rule.required(),
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
              name: 'cta',
              title: 'CTA',
              type: 'link',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'itemList',
              title: 'Item List',
              type: 'itemList',
            },
            getMediaAssetFields({
              name: 'media',
              isRequired: true,
              typesAllowed: ['imageAsset', 'video'],
              description: 'Image should be at least 1800px in width.',
              customValidation: (Rule: Rule) => {
                const validation = Rule.custom((value, context) => {
                  if (value?.media?.length === 1 && value?.media[0]?._type === 'imageAsset') {
                    return getImageValidation({
                      image: value?.media[0],
                      required: true,
                      minWidth: 1800,
                    })
                  }
                  return true
                })
                return validation
              },
            }),
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
            prepare(selection: any) {
              const {title, media} = selection
              return {
                title: title || 'Item',
                media,
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
      items: 'items',
    },
    prepare(selection: any) {
      const {cmsSettings, items} = selection
      const title = cmsSettings?.cmsTitle || 'Expanding Image and Content'
      const itemCount = items?.length || 0

      return {
        title: `${title}${itemCount ? ` (${itemCount} items)` : ''}`,
      }
    },
  },
}
