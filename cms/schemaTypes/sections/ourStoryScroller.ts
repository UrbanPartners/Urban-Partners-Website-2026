import {Rule} from 'sanity'
import {getRichTextFields} from '../../utils/richText'
import {getMediaAssetFields} from '../objects/mediaAsset'

export default {
  name: 'ourStoryScroller',
  title: 'Our Story Scroller',
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
        cmsTitle: 'Our Story Scroller',
      },
    },
    {
      name: 'introSection',
      title: 'Intro Section',
      type: 'object',
      fields: [
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
        },
        {
          name: 'description',
          title: 'Description',
          type: 'array',
          validation: (Rule: Rule) => Rule.required(),
          of: [
            getRichTextFields({
              items: ['link', 'strong'],
            }),
          ],
        },
        {
          name: 'caseStudyListDescription',
          title: 'Case Study List Description',
          type: 'array',
          validation: (Rule: Rule) => Rule.required(),
          of: [
            getRichTextFields({
              items: ['link', 'strong'],
            }),
          ],
        },
        {
          name: 'caseStudyItems',
          title: 'Case Study Items',
          type: 'array',
          validation: (Rule: Rule) => Rule.required().min(2).max(4),
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
                  type: 'text',
                  rows: 2,
                  validation: (Rule: Rule) => Rule.required(),
                },
                {
                  name: 'image',
                  title: 'Image',
                  type: 'imageAsset',
                  validation: (Rule: Rule) => Rule.required(),
                },
                {
                  name: 'imageOverlayOpacity',
                  title: 'Image Overlay Opacity',
                  description: '0-100',
                  type: 'number',
                  initialValue: 40,
                  validation: (Rule: Rule) => Rule.min(0).max(100),
                },
                {
                  name: 'cta',
                  title: 'CTA',
                  type: 'link',
                  validation: (Rule: Rule) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  title: 'title',
                },
                prepare(selection: any) {
                  const {title} = selection
                  return {
                    title: title || 'Case Study Item',
                  }
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'timelineSection',
      title: 'Timeline Section',
      type: 'object',
      fields: [
        {
          name: 'yearPrefix',
          title: 'Year Prefix',
          type: 'string',
          validation: (Rule: Rule) => Rule.required().min(2).max(2),
          description: "For example, 2005 would be '20'",
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          name: 'itemsByYear',
          title: 'Items By Year',
          type: 'array',
          description: 'Minimum 1, Maximum 20',
          validation: (Rule: Rule) => Rule.required().min(1).max(20),
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'yearSuffix',
                  title: 'Year Suffix',
                  type: 'string',
                  validation: (Rule: Rule) => Rule.required().min(2).max(2),
                  description: "For example, 2005 would be '05'",
                },
                {
                  name: 'items',
                  title: 'Items',
                  type: 'array',
                  description: 'Minimum 1, Maximum 10',
                  validation: (Rule: Rule) => Rule.required().min(1).max(10),
                  of: [
                    {
                      type: 'object',
                      fields: [
                        {
                          name: 'image',
                          title: 'Image',
                          type: 'imageAsset',
                          validation: (Rule: Rule) => Rule.required(),
                        },
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
                          validation: (Rule: Rule) => Rule.required(),
                          of: [
                            getRichTextFields({
                              items: ['link', 'strong'],
                            }),
                          ],
                        },
                        {
                          name: 'imageLayout',
                          title: 'Image Layout',
                          type: 'string',
                          initialValue: 'portrait',
                          validation: (Rule: Rule) => Rule.required(),
                          options: {
                            list: [
                              {title: 'Landscape', value: 'landscape'},
                              {title: 'Portrait', value: 'portrait'},
                            ],
                            layout: 'radio',
                          },
                        },
                      ],
                      preview: {
                        select: {
                          title: 'title',
                          imageLayout: 'imageLayout',
                          image: 'image',
                        },
                        prepare(selection: any) {
                          const {title, imageLayout, image} = selection
                          return {
                            title: title || 'Timeline Item',
                            subtitle: imageLayout ? `Layout: ${imageLayout}` : '',
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
                  yearSuffix: 'yearSuffix',
                },
                prepare(selection: any) {
                  const {yearSuffix} = selection
                  return {
                    title: yearSuffix ? `Year: ${yearSuffix}` : 'Year Item',
                  }
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'locationsSection',
      title: 'Locations Section',
      type: 'object',
      fields: [
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
          type: 'array',
          validation: (Rule: Rule) => Rule.required(),
          of: [
            getRichTextFields({
              items: ['link', 'strong'],
            }),
          ],
        },
        {
          name: 'cta',
          title: 'CTA',
          type: 'linkNoDisabled',
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          name: 'locations',
          title: 'Locations',
          type: 'array',
          validation: (Rule: Rule) => Rule.required().min(2).max(12),
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
                  validation: (Rule: Rule) => Rule.required(),
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
                    title: title || 'Location',
                    media: image,
                  }
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'mediaSection',
      title: 'Media Section',
      type: 'object',
      fields: [
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
          rows: 3,
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'imageAsset',
          validation: (Rule: Rule) => Rule.required(),
          description: 'This will override Preview Image if video player selected for media',
        },
        {
          name: 'backgroundImageOverlay',
          title: 'Background Image Overlay',
          type: 'number',
          validation: (Rule: Rule) => Rule.required().min(0).max(100),
          initialValue: 40,
        },
        getMediaAssetFields({
          name: 'media',
          isRequired: false,
          typesAllowed: ['videoPlayer'],
        }),
        {
          name: 'cta',
          title: 'CTA',
          type: 'link',
          description: 'If video media is entered, this CTA will be hidden.',
          initialValue: {
            linkType: 'disabled',
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
      const title = cmsSettings?.cmsTitle || 'Our Story Scroller'

      return {
        title,
      }
    },
  },
}
