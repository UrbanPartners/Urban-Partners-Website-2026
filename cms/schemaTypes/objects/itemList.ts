import {Rule} from 'sanity'
import getRichTextFields from '../../utils/richText'

const video = {
  name: 'itemList',
  title: 'Item List',
  type: 'object',
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'array',
              of: [
                getRichTextFields({
                  items: ['strong', 'link'],
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default video
