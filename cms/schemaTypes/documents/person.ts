import {Rule} from 'sanity'
import {SanityDocument} from 'sanity/migrate'
import {generateFieldsByLanguage} from './page'
import {DEFAULT_LANGUAGE} from '../../data/languages'

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
            name: 'linkedInUrl',
            title: 'LinkedIn URL',
          },
          {
            type: 'string',
            name: 'email',
          },
          {
            type: 'imageAsset',
            name: 'image',
          },
        ]
      },
    }),
  ],
}
