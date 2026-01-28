import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'
import {getRequiredImageDimensionsValidation} from '../../utils'

export default {
  name: 'imageAndTextAccordion',
  title: 'Image and Text Accordion',
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
        cmsTitle: 'Image and Text Accordion',
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
              name: 'description',
              title: 'Description',
              type: 'array',
              validation: (Rule: Rule) => Rule.required(),
              of: [
                getRichTextFields({
                  items: [],
                }),
              ],
            },
            {
              name: 'bigNumber',
              title: 'Big Number',
              type: 'string',
            },
            {
              name: 'bigNumberSubtitle',
              title: 'Big Number Subtitle',
              type: 'string',
              hidden: (context: any) => !context.parent.bigNumber,
            },
            {
              name: 'itemList',
              title: 'Item List',
              type: 'itemList',
            },
          ],
          preview: {
            select: {
              title: 'title',
              image: 'image',
            },
            prepare(selection: any) {
              const {title, image} = selection
              return {
                title: title || 'Item',
                media: image,
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
    },
    prepare(selection: any) {
      const {cmsSettings} = selection
      const title = cmsSettings?.cmsTitle || 'Image and Text Accordion'

      return {
        title,
      }
    },
  },
}
