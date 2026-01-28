import {Rule} from 'sanity'
import {SanityDocument} from 'sanity/migrate'
import {generateFieldsByLanguage} from './page'
import {DEFAULT_LANGUAGE} from '../../data/languages'

export default {
  name: 'blogCategory',
  title: 'Blog Category',
  type: 'document',
  preview: {
    select: {
      title: `${DEFAULT_LANGUAGE}Data.title`,
    },
    prepare({title}: {title: string}) {
      return {title}
    },
  },
  fields: [
    ...generateFieldsByLanguage({
      titleSuffix: '',
      parentName: 'data',
      nameSuffix: 'Data',
      showDefaultLanguage: true,
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
            name: 'title',
            validation: (Rule: Rule) =>
              Rule.custom((_: any, context: any) => {
                if (!context?.parent?.title && context?.parent?.lang === DEFAULT_LANGUAGE) {
                  return 'Required'
                }
                return true
              }),
          },
        ]
      },
    }),

    {
      name: 'slug',
      title: 'Slug', //
      type: 'slug',
      description: 'This is for generating a unique ID. Please do not edit without intention.',
      options: {
        source: (_: SanityDocument, context: {parent: {[key: string]: {title: string}}}) => {
          if (!context?.parent[`${DEFAULT_LANGUAGE}Data`]?.title) return ''
          return context?.parent[`${DEFAULT_LANGUAGE}Data`]?.title
        },
      },
      validation: (Rule: Rule) => Rule.required(),
    },
  ],
}
