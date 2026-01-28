import {Rule} from 'sanity'

const richTextBlockquote = {
  name: 'richTextBlockquote',
  title: 'Blockquote',
  type: 'object',
  fields: [
    {
      name: 'quote',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'author',
      type: 'string',
    },
  ],
}

export default richTextBlockquote
