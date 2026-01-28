import {Rule} from 'sanity'

export default {
  name: 'newsSearchAndTitle',
  title: 'News Search and Title',
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
        cmsTitle: 'News Search and Title',
      },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'hideDropdowns',
      title: 'Hide Dropdowns',
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
      const title = cmsSettings?.cmsTitle || 'News Search and Title'

      return {
        title,
      }
    },
  },
}
