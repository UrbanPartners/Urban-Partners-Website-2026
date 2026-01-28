import {ConditionalPropertyCallbackContext, Rule} from 'sanity'

const linkTypeField = {
  name: 'linkType',
  title: 'Link Type',
  type: 'string',
  description: 'External links will always open in a new tab.',
  initialValue: 'internal',
  options: {
    list: [
      {title: 'Internal', value: 'internal'},
      {title: 'External', value: 'external'},
      {title: 'File', value: 'file'},
      {title: 'Disabled', value: 'disabled'},
    ],
    layout: 'radio',
    direction: 'horizontal',
  },
}

const linkTypeFieldNoDisabled = {
  ...linkTypeField,
  options: {
    ...linkTypeField.options,
    list: linkTypeField.options.list.filter((option) => option.value !== 'disabled'),
  },
}

const fields = [
  linkTypeField,
  {
    type: 'string',
    name: 'label',
    title: 'Label',
    hidden: ({parent}: ConditionalPropertyCallbackContext) => parent?.linkType === 'disabled',
  },
  {
    name: 'fileLink',
    title: 'File Link',
    type: 'file',
    hidden: ({parent}: ConditionalPropertyCallbackContext) => parent?.linkType !== 'file',
    validation: (rule: Rule) =>
      rule.custom((value: any, context: any) => {
        if (context.parent.linkType === 'file') {
          if (!value) {
            return 'This field is required'
          }
        }
        return true
      }),
  },
  {
    name: 'internalLink',
    title: 'Link',
    toggleable: true,
    type: 'reference',
    to: [{type: 'page'}, {type: 'blogPost'}, {type: 'caseStudy'}],
    hidden: ({parent}: ConditionalPropertyCallbackContext) => parent?.linkType !== 'internal',
    validation: (rule: Rule) =>
      rule.custom((value: any, context: any) => {
        if (context.parent.linkType === 'internal' && !value) {
          return 'This field is required'
        } else {
          return true
        }
      }),
  },
  {
    name: 'externalLink',
    title: 'Link URL',
    toggleable: true,
    type: 'string',
    hidden: ({parent}: ConditionalPropertyCallbackContext) => parent?.linkType !== 'external',
    description:
      'Make sure that you use the full URL, for example: https://www.google.com as opposed to google.com',
    validation: (rule: Rule) =>
      rule.custom((value: any, context: any) => {
        if (context.parent.linkType === 'external' && !value) {
          return 'This field is required'
        } else {
          return true
        }
      }),
  },
  {
    name: 'hash',
    title: 'Hash',
    description: "Optional ID to link to on page. Enter the ID only - Don't add the '#' in front. ",
    type: 'string',
    hidden: ({parent}: ConditionalPropertyCallbackContext) => parent?.linkType !== 'internal',
  },
]

const link = {
  name: 'link',
  title: 'Link',
  type: 'object',
  initialValue: {
    linkType: 'internal',
  },
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [...fields],
  preview: {
    select: {
      title: 'label',
    },
    prepare({title}: {title: string}) {
      return {
        title,
      }
    },
  },
}

const linkNoLabel = {
  name: 'linkNoLabel',
  title: 'Link',
  type: 'object',
  initialValue: {
    linkType: 'internal',
  },
  fields: [...fields.filter((field) => field.name !== 'label')],
  preview: {
    select: {
      title: 'label',
    },
    prepare({title}: {title: string}) {
      return {
        title,
      }
    },
  },
}

const linkNoDisabled = {
  name: 'linkNoDisabled',
  title: 'Link',
  type: 'object',
  initialValue: {
    linkType: 'internal',
  },
  fields: [
    linkTypeFieldNoDisabled,
    ...fields.filter((field) => {
      return field.name !== 'linkType'
    }),
  ],
  preview: {
    select: {
      title: 'label',
    },
    prepare({title}: {title: string}) {
      return {
        title,
      }
    },
  },
}

const linkNoDisabledNoLabel = {
  name: 'linkNoDisabledNoLabel',
  title: 'Link',
  type: 'object',
  initialValue: {
    linkType: 'internal',
  },
  fields: [
    linkTypeFieldNoDisabled,
    ...fields.filter((field) => {
      return field.name !== 'linkType' && field.name !== 'label'
    }),
  ],
  preview: {
    select: {
      title: 'label',
    },
    prepare({title}: {title: string}) {
      return {
        title,
      }
    },
  },
}

const moduleExports = {
  link,
  linkNoLabel,
  linkNoDisabled,
  linkNoDisabledNoLabel,
}

export default moduleExports
