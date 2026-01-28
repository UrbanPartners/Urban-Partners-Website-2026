import {Rule} from 'sanity'
import Vimeo from '../../components/Vimeo'
import {getRequiredImageDimensionsValidation} from '../../utils'

const videoPlayer = {
  name: 'videoPlayer',
  title: 'Video Player',
  type: 'object',
  preview: {
    select: {
      previewImage: 'previewImage',
    },
    prepare(selection: any) {
      const {previewImage} = selection
      return {
        title: 'Vimeo Video',
        media: previewImage,
      }
    },
  },
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
    {
      type: 'imageAsset',
      name: 'previewImage',
      title: 'Preview Image',
      description: 'Image should be at least 2000px wide',
      validation: (Rule: Rule) =>
        getRequiredImageDimensionsValidation({
          Rule,
          minWidth: 2000,
        }),
    },
    {
      type: 'number',
      name: 'previewOverlayOpacity',
      initialValue: 40,
    },
  ],
}

export default videoPlayer
