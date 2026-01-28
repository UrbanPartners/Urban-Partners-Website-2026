import {Rule} from 'sanity'

const defaultSettings = {
  isRequired: false,
  name: 'mediaAsset',
  title: 'Media Asset',
}

type MediaTypes = 'imageAsset' | 'video' | 'videoPlayer'

export const getMediaAssetFields = ({
  isRequired = false,
  name = 'mediaAsset',
  title = 'Media Asset',
  typesAllowed = ['imageAsset', 'video', 'videoPlayer'],
  description = '',
  customValidation = null,
}: {
  isRequired?: boolean
  name?: string
  title?: string
  typesAllowed?: MediaTypes[]
  description?: string
  customValidation?: null | ((Rule: Rule) => Rule)
}) => {
  const settings = {
    ...defaultSettings,
    isRequired,
    name,
    title,
    description,
  }

  let validation = (Rule: Rule) => (settings.isRequired ? Rule.required() : Rule.optional())
  if (customValidation) {
    validation = (Rule: Rule) => customValidation(Rule)
  }

  const fields = {
    name: settings.name,
    title: settings.title,
    description: settings.description,
    type: 'object',
    validation,
    fields: [
      {
        name: 'media',
        title: 'Media',
        type: 'array',
        of: typesAllowed.map((type) => ({type})),
        validation: (Rule: Rule) => Rule.min(1).max(1),
      },
    ],
  }

  return fields
}

const mediaAsset = getMediaAssetFields({})

export default mediaAsset
