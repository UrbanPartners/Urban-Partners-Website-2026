const spacing = [
  {title: 'Auto', value: 'auto'},
  {title: '0px', value: '0'},
  {title: '4px', value: '4'},
  {title: '8px', value: '8'},
  {title: '16px', value: '16'},
  {title: '24px', value: '24'},
  {title: '32px', value: '32'},
  {title: '40px', value: '40'},
  {title: '48px', value: '48'},
  {title: '56px', value: '56'},
  {title: '64px', value: '64'},
  {title: '80px', value: '80'},
  {title: '95px', value: '95'},
  {title: '105px', value: '105'},
  {title: '115px', value: '115'},
  {title: '128px', value: '128'},
]

const lineWidths = [
  {title: 'Section Container (width of section)', value: 'section-container'},
  {title: 'Full (to edge of screen)', value: 'full'},
]

export default {
  name: 'spacer',
  title: 'Spacer',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fieldsets: [
    {
      name: 'spacingFieldsetNoLine',
      title: 'Spacings',
      options: {columns: 2},
    },
    {
      name: 'spacingFieldsetHasLine',
      title: 'Spacings',
      options: {columns: 2},
    },
  ],
  fields: [
    {
      name: 'hasLine',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'topDesktop',
      title: 'Top (Desktop)',
      type: 'string',
      fieldset: 'spacingFieldsetHasLine',
      options: {
        list: spacing,
      },
      initialValue: 'auto',
      hidden: ({parent}: any) => !parent?.hasLine,
    },
    {
      name: 'topMobile',
      title: 'Top (Mobile)',
      type: 'string',
      fieldset: 'spacingFieldsetHasLine',
      options: {
        list: spacing,
      },
      initialValue: 'auto',
      hidden: ({parent}: any) => !parent?.hasLine,
    },
    {
      name: 'bottomDesktop',
      title: 'Bottom (Desktop)',
      type: 'string',
      fieldset: 'spacingFieldsetHasLine',
      options: {
        list: spacing,
      },
      initialValue: 'auto',
      hidden: ({parent}: any) => !parent?.hasLine,
    },
    {
      name: 'bottomMobile',
      title: 'Bottom (Mobile)',
      type: 'string',
      fieldset: 'spacingFieldsetHasLine',
      options: {
        list: spacing,
      },
      initialValue: 'auto',
      hidden: ({parent}: any) => !parent?.hasLine,
    },
    {
      name: 'desktop',
      title: 'Desktop',
      type: 'string',
      fieldset: 'spacingFieldsetNoLine',
      options: {
        list: spacing,
      },
      initialValue: 'auto',
      hidden: ({parent}: any) => parent?.hasLine,
    },
    {
      name: 'mobile',
      title: 'Mobile',
      type: 'string',
      fieldset: 'spacingFieldsetNoLine',
      options: {
        list: spacing,
      },
      initialValue: 'auto',
      hidden: ({parent}: any) => parent?.hasLine,
    },
    {
      name: 'lineWidth',
      type: 'string',
      options: {
        list: lineWidths,
      },
      initialValue: 'section-container',
      hidden: ({parent}: any) => !parent?.hasLine,
    },
  ],
  preview: {
    select: {
      hasLine: 'hasLine',
      topDesktop: 'topDesktop',
      topMobile: 'topMobile',
      bottomDesktop: 'bottomDesktop',
      bottomMobile: 'bottomMobile',
      desktop: 'desktop',
      mobile: 'mobile',
    },
    prepare(selection: any) {
      const {hasLine, topDesktop, topMobile, bottomDesktop, bottomMobile, desktop, mobile} =
        selection

      let subtitle = `Desktop: ${spacing.find((s) => s.value === desktop)?.title || desktop}, Mobile: ${spacing.find((s) => s.value === mobile)?.title || mobile}`
      if (hasLine) {
        subtitle = `
          Desktop top ${spacing.find((s) => s.value === topDesktop)?.title || topDesktop}, bottom: ${spacing.find((s) => s.value === bottomDesktop)?.title || bottomDesktop}, 
          Mobile top: ${spacing.find((s) => s.value === topMobile)?.title || topMobile}, bottom: ${spacing.find((s) => s.value === bottomMobile)?.title || bottomMobile}
        `
      }

      return {
        title: hasLine ? '📏 Spacer with Line' : '📏 Spacer',
        subtitle,
      }
    },
  },
}
