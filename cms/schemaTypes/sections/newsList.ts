import {Rule} from 'sanity'

export default {
  name: 'newsList',
  title: 'News List',
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
        cmsTitle: 'News List',
      },
    },
    {
      name: 'variant',
      title: 'Variant',
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
      description:
        'Variant A is the staggered news list with set number of items, Variant B is the stacked news list with pagination',
    },
    {
      name: 'offsetPosts',
      title: 'Offset Posts',
      type: 'boolean',
      initialValue: false,
      hidden: (context: any) => context.parent.variant !== 'b',
      description:
        'If true, the list of items will be offset by the number of posts in Variant A so there are no duplicates.',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
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
