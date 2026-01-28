import {Rule} from 'sanity'
import {getImageDimensions} from '@sanity/asset-utils'
import {LANGUAGES} from '../../data/languages'

type FieldSchema = {
  name: string
  title: string
  type: string
  validation?: (rule: Rule) => Rule
  description?: string
}

const fieldsSchema: FieldSchema[] = [
  {
    name: 'title',
    title: 'Title',
    type: 'string',
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 2,
  },
  {
    name: 'allowCrawlers',
    title: 'Allow Crawlers',
    type: 'boolean',
  },
  {
    name: 'keywords',
    title: 'Keywords',
    type: 'string',
  },
  {
    name: 'image',
    title: 'Image',
    type: 'image',
    description: 'Image must be 1600x900 pixels',
    validation: (rule: Rule) =>
      rule.custom((value: any) => {
        if (!value) return true

        const {width, height} = getImageDimensions(value.asset._ref)

        if (width !== 1600 || height !== 900) {
          return 'Image must be 1600x900 pixels'
        }

        return true
      }),
  },
  {
    name: 'favicon',
    title: 'Favicon',
    type: 'image',
    description: 'Image must be 500x500 pixels in PNG format',
    validation: (rule: Rule) =>
      rule.custom((value: any) => {
        if (!value) return true

        const {width, height} = getImageDimensions(value.asset._ref)

        if (width !== 500 || height !== 500) {
          return 'Image must be 500x500 pixels in PNG format'
        }

        return true
      }),
  },
  {
    name: 'metaBackgroundColorHex',
    title: 'Background Color Hex',
    description:
      'For manifest.json. It is the background color of the page before things load. ie "#000000"',
    type: 'string',
  },
  {
    name: 'themeColorHex',
    title: 'Theme Color Hex',
    description: 'For manifest.json. It is the UI color (nav bar) on some OS. ie "#000000"',
    type: 'string',
  },
]

export const generateMetadataFields = (fields: string[]) => {
  const fieldsToGenerate: FieldSchema[] = []

  fields.forEach((field) => {
    const desiredField = fieldsSchema.filter((fieldObject) => fieldObject.name === field)[0]
    if (!desiredField) return
    fieldsToGenerate.push(desiredField)
  })

  return fieldsToGenerate
}

const getSiteSettingsFields = () => {
  const fields = Object.values(LANGUAGES).map((lang) => {
    return {
      name: `${lang}SiteSettingsMetadata`,
      title: `${lang.toUpperCase()} Site Settings Metadata`,
      type: 'object',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        ...generateMetadataFields([
          'title',
          'description',
          'keywords',
          'image',
          'favicon',
          'metaBackgroundColorHex',
          'themeColorHex',
        ]),
      ],
    }
  })

  return fields
}

const siteSettingsMetadata = {
  name: 'siteSettingsMetadata',
  title: 'Site Settings Metadata',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [...getSiteSettingsFields()],
}

const pageMetadata = {
  name: 'pageMetadata',
  title: 'Page Metadata',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  initialValue: {
    allowCrawlers: true,
  },
  fields: [
    ...generateMetadataFields(['title', 'description', 'keywords', 'image', 'allowCrawlers']),
  ],
}

const exports = {siteSettingsMetadata, pageMetadata}

export default exports
