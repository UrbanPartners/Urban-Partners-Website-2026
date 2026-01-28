import {Rule} from 'sanity'

const button = {
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    {
      name: 'link',
      title: 'Link',
      type: 'link',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
      hidden: ({parent}: {parent: {link: {linkType: string}}}) =>
        parent?.link?.linkType === 'disabled',
      initialValue: 'arrowRight',
      options: {
        list: [
          {title: 'Arrow Diagonal', value: 'arrowDiagonal'},
          {title: 'Arrow Down', value: 'arrowDown'},
          {title: 'Arrow Right', value: 'arrowRight'},
          {title: 'Caret Down', value: 'caretDown'},
          {title: 'Caret Right', value: 'caretRight'},
          {title: 'Download', value: 'download'},
        ],
        layout: 'dropdown',
      },
    },
  ],
  preview: {
    select: {
      label: 'link.label',
      icon: 'icon',
    },
    prepare({label, icon}: {label?: string; icon?: string}) {
      return {
        title: label || 'Button',
        subtitle: icon ? `Icon: ${icon}` : 'No icon',
      }
    },
  },
}

export default button
