import {Rule} from 'sanity'
import Vimeo from '../../components/Vimeo'

const video = {
  name: 'video',
  title: 'Video',
  type: 'object',
  fields: [
    {
      type: 'vimeoData',
      name: 'vimeoData',
      title: 'Vimeo ID',
      validation: (Rule: Rule) => Rule.required(),
      components: {
        input: Vimeo,
      },
    },
  ],
}

export default video
