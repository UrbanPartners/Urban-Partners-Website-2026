import {Rule} from 'sanity'

export default {
  name: 'fourOhFour',
  title: 'Four Oh Four',
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
        cmsTitle: 'Four Oh Four',
      },
    },
    {
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      initialValue: 'image',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      type: 'imageAsset',
      name: 'image',
      title: 'Image',
      hidden: (context: any) => {
        return context.parent.mediaType !== 'image'
      },
    },
    {
      title: 'Video Loop (Desktop)',
      name: 'videoLoopDesktop',
      type: 'file',
      description: 'IMPORTANT: Must be under 3MB, or it will not show up.',
      hidden: (context: any) => {
        return context.parent.mediaType !== 'video'
      },
      validation: (Rule: Rule) =>
        Rule.custom((value, context: any) => {
          if (context?.parent?.mediaType === 'video' && !value) {
            return 'This field is required'
          }

          return true
        }),
    },
    {
      title: 'Video Loop (Mobile)',
      name: 'videoLoopMobile',
      type: 'file',
      description: 'IMPORTANT: Must be under 750KB, or it will not show up.',
      hidden: (context: any) => {
        return context.parent.mediaType !== 'video'
      },
      validation: (Rule: Rule) =>
        Rule.custom((value, context: any) => {
          if (context?.parent?.mediaType === 'video' && !value) {
            return 'This field is required'
          }

          return true
        }),
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
    },
    prepare(selection: any) {
      const {cmsSettings} = selection
      const title = cmsSettings?.cmsTitle || 'Four Oh Four'

      return {
        title,
      }
    },
  },
}
