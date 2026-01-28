---
to: cms/schemaTypes/sections/<%= h.inflection.camelize( name, true ) %>.ts
---
export default {
  name: '<%= h.inflection.camelize( name, true ) %>',
  title: '<%= h.inflection.transform( name, [ 'humanize', 'titleize' ] ) %>',
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
        cmsTitle: '<%= h.inflection.transform( name, [ 'humanize', 'titleize' ] ) %>',
      },
    },
  ],
  preview: {
    select: {
      cmsSettings: 'cmsSettings',
    },
    prepare(selection: any) {
      const { cmsSettings } = selection
      const title = cmsSettings?.cmsTitle || '<%= h.inflection.transform( name, [ 'humanize', 'titleize' ] ) %>'

      return {
        title,
      }
    },
  },
}
