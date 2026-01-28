import {Rule} from 'sanity'

export default {
  name: 'expandingCarousel',
  title: 'Expanding Carousel',
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
        cmsTitle: 'Expanding Carousel',
      },
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'blogPost'}, {type: 'caseStudy'}],
        },
        {
          type: 'customCard',
        },
      ],
      validation: (Rule: Rule) => Rule.required().min(1).max(12),
    },
    {
      name: 'numberPrefix',
      title: 'Number Prefix',
      type: 'string',
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
    },
    prepare(selection: any) {
      const {cmsSettings} = selection
      const title = cmsSettings?.cmsTitle || 'Expanding Carousel'

      return {
        title,
      }
    },
  },
}
