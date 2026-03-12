import {Rule} from 'sanity'
import {SanityDocument} from 'sanity/migrate'
import {generateFieldsByLanguage} from './page'
import {DEFAULT_LANGUAGE} from '../../data/languages'
import getRichTextFields from '../../utils/richText'

export default {
  name: 'person',
  title: 'Person',
  type: 'document',
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      image: `${DEFAULT_LANGUAGE}PersonData.image`,
    },
    prepare(selection: {firstName: string; lastName: string; image: any}) {
      return {
        title: `${selection?.firstName} ${selection?.lastName}`,
        media: selection?.image,
      }
    },
  },
  fields: [
    {
      name: 'firstName',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'lastName',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug', //
      type: 'slug',
      description: 'This is for generating a unique ID. Please do not edit without intention.',
      options: {
        source: (_: SanityDocument, context: {parent: {firstName: string; lastName: string}}) => {
          if (!context?.parent?.firstName) return ''
          return `${context?.parent?.firstName}${context?.parent?.lastName ? `-${context?.parent?.lastName}` : ''}`
            .trim()
            .toLowerCase()
            .replace(/ /g, '-')
        },
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    ...generateFieldsByLanguage({
      titleSuffix: '',
      parentName: 'personData',
      nameSuffix: 'PersonData',
      fieldsFunction: (lang) => {
        return [
          {
            type: 'string',
            name: 'lang',
            validation: (Rule: Rule) => Rule.required(),
            hidden: true,
            initialValue: lang,
          },
          {
            type: 'string',
            name: 'designation',
            description: 'ie "Manager"',
          },
          {
            type: 'string',
            name: 'designation2',
            description: 'ie "Partner at Urban Partners"',
          },
          {
            type: 'string',
            name: 'linkedInUrl',
            title: 'LinkedIn URL',
          },
          {
            type: 'string',
            name: 'email',
          },
          {
            type: 'string',
            name: 'phoneNumber',
            description: 'ie "+44 7900 000 000"',
          },
          {
            type: 'string',
            name: 'location',
            description: 'ie "London"',
          },
          {
            type: 'imageAsset',
            name: 'image',
          },
          {
            name: 'bioSummary',
            title: 'Bio Summary',
            description: 'This is the large text that shows up above the rest of the bio',
            type: 'array',
            of: [
              getRichTextFields({
                items: [],
              }),
            ],
          },
          {
            name: 'bio',
            title: 'Bio',
            type: 'array',
            of: [
              getRichTextFields({
                items: ['strong', 'link'],
              }),
            ],
          },
        ]
      },
    }),
  ],
}
