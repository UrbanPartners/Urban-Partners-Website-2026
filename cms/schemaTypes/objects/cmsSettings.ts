import {Rule} from 'sanity'

export default {
  name: 'cmsSettings',
  title: 'cms Settings',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    {
      name: 'isHidden',
      title: 'Is Hidden',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'cmsTitle',
      title: 'CMS Title',
      description: 'For CMS lookups and referencing',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'id',
      title: 'ID',
      description: 'ID for the HTML element',
      type: 'string',
    },
    {
      name: 'zIndex',
      title: 'Z Index',
      description: 'Z Index for the HTML element',
      type: 'number',
    },
  ],
}
