import {Rule, SanityDocument} from 'sanity'
import {DEFAULT_LANGUAGE, LANGUAGES} from '../../data/languages'
import {sectionTypes} from './sharedSection'
import LanguageGridSelect from '../../components/LanguageGridSelect'
import {factsListDescriptionFields} from '../sections/factList'
import {getImageValidation, getRequiredImageDimensionsValidation} from '../../utils'
import {CopyFromLocaleArrayInput} from '../../components/CopySections'

const LOCATION_HOME_SLUG = 'home'

export const generateFieldsByLanguage = ({
  nameSuffix,
  titleSuffix,
  parentName,
  fieldsFunction,
  showDefaultLanguage = true,
}: {
  fieldsFunction: (lang: string) => any[]
  parentName: string
  titleSuffix: string
  nameSuffix: string
  showDefaultLanguage?: boolean
}) => {
  return Object.values(LANGUAGES).map((lang) => {
    const fields = fieldsFunction(lang)
    const name = `${lang}${nameSuffix}`

    let fieldObj: any = {
      type: 'object',
      name,
      title: `${lang.toUpperCase()} ${titleSuffix}`,
      options: {
        collapsible: true,
        collapsed: showDefaultLanguage ? lang !== DEFAULT_LANGUAGE : true,
      },
      fields,
    }

    if (lang === DEFAULT_LANGUAGE) {
      fieldObj.description = `All other languages will inherit content from ${DEFAULT_LANGUAGE.toLocaleUpperCase()} if they are left blank.`
    }

    return fieldObj
  })
}

export const getLocalizedObjectValidation = ({
  context,
  fieldObjectFunction,
  objectTitle,
  objectNameSuffix,
  parentObjectName,
}: {
  context: any
  objectTitle: string
  objectNameSuffix: string
  parentObjectName: string
  fieldObjectFunction: ({
    fieldObject,
    language,
    addError,
  }: {
    fieldObject: any
    language: string
    addError: (error: string) => void
  }) => void
}) => {
  let isValid: boolean | string = true
  if (!context.document?.isEnabled) return true

  const addError = (error: string) => {
    if (typeof isValid === 'string') {
      isValid += ` ${error}`
    } else {
      isValid = `${error}`
    }
  }

  Object.values(LANGUAGES).map((lang: string) => {
    if (context.document.isEnabled.includes(lang)) {
      if (!context?.document[parentObjectName]) {
        if (lang === DEFAULT_LANGUAGE) {
          addError(`Must enter content for ${objectTitle}.`)
        }
      } else {
        let fieldObject = context?.document[parentObjectName][`${lang}${objectNameSuffix}`]

        if (lang !== DEFAULT_LANGUAGE) {
          const defaultLanguageObject =
            context?.document[parentObjectName][`${DEFAULT_LANGUAGE}${objectNameSuffix}`]
          fieldObject = {
            ...defaultLanguageObject,
            ...fieldObject,
          }
        }

        fieldObjectFunction({fieldObject, language: lang, addError})
      }
    }
  })

  return isValid
}

const getMetadataByLocales = () => {
  const fields = Object.values(LANGUAGES).map((lang) => {
    return {
      type: 'pageMetadata',
      name: `${lang}Metadata`,
      title: `${lang.toUpperCase()}`,
      options: {
        collapsible: true,
        collapsed: lang !== DEFAULT_LANGUAGE,
      },
    }
  })

  const objectField = {
    type: 'object',
    name: 'metadata',
    group: 'metadata',
    title: 'Metadata',
    // options: {
    //   collapsible: true,
    //   collapsed: true,
    // },
    fields,
  }

  return objectField
}

const GET_SECTIONS_BY_LOCALES_DEFAULT_SETTINGS = {
  whitelistSections: sectionTypes,
  group: 'content',
}

const getSectionsByLocales = ({
  whitelistSections = GET_SECTIONS_BY_LOCALES_DEFAULT_SETTINGS.whitelistSections,
  group = GET_SECTIONS_BY_LOCALES_DEFAULT_SETTINGS.group,
}: {
  whitelistSections?: string[]
  group?: string
}) => {
  const settings = {
    ...GET_SECTIONS_BY_LOCALES_DEFAULT_SETTINGS,
    whitelistSections,
    group,
  }

  const sectionsAllowed = sectionTypes
    .map((type) => {
      let title = type
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
        .trim()
      if (type === 'spacer') {
        title = '📏 Spacer'
      }

      return {
        title,
        type,
      }
    })
    .filter((section) => settings.whitelistSections.includes(section.type))
    .sort((a, b) => {
      // Put spacer at the top
      if (a.type === 'spacer' && b.type !== 'spacer') return -1
      if (b.type === 'spacer' && a.type !== 'spacer') return 1
      // Alphabetical order for the rest
      return a.type.localeCompare(b.type)
    })

  const fields = {
    type: 'object',
    name: 'sections',
    title: 'Sections',
    group,
    options: {
      collapsible: true,
    },
    fields: [
      // {
      //   name: 'dkSections',
      //   title: 'DK Sections',
      //   type: 'array',
      //   of: [{type: 'section'}],
      //   components: {
      //     input: CopyFromLocaleArrayInput,
      //   },
      //   options: {
      //     sourcePath: ['enSections'],   // adjust if nested, e.g. ['sections', 'en']
      //     mode: 'replace',              // or 'append'
      //   },
      // },
      ...Object.values(LANGUAGES).map((lang) => {
        const obj: any = {
          name: `${lang}Sections`,
          title: `${lang.toUpperCase()} Sections`,
          type: 'array',
          of: [
            {
              name: 'sharedSection',
              title: '🔗 Shared Section',
              type: 'reference',
              to: [{type: 'sharedSection'}],
            },
            ...sectionsAllowed,
          ],
        }

        if (lang !== DEFAULT_LANGUAGE) {
          obj.components = {
            input: CopyFromLocaleArrayInput,
          }

          obj.options = {
            sourcePath: [`sections.${DEFAULT_LANGUAGE}Sections`], // adjust if nested, e.g. ['sections', 'en']
            targetPath: [`sections.${lang}Sections`],
          }
        }

        return obj
      }),
    ],
  }

  return fields
}

const getInitialValueFields = () => {
  const isEnabled: any = Object.values(LANGUAGES).map((lang) => lang)

  return {isEnabled}
}

const getPageSchema = ({
  name,
  title,
  basePath,
  extraFields = [],
  hasTitleTranslationFields = true,
  additionalGroups = [],
}: {
  name: string
  title: string
  basePath?: string
  extraFields?: any[]
  hasTitleTranslationFields?: boolean
  additionalGroups?: any[]
}) => {
  const getTitleFields = () => {
    const mainTitleFields = {
      type: 'string',
      name: `${DEFAULT_LANGUAGE}Title`,
      title: `Title (${DEFAULT_LANGUAGE.toUpperCase()})`,
      description: 'This title will show up in the browser tab',
      group: 'basicInformation',
      validation: (Rule: Rule) => Rule.required(),
    }

    if (!hasTitleTranslationFields) {
      return [mainTitleFields]
    } else {
      return [
        mainTitleFields,
        ...Object.values(LANGUAGES)
          .map((lang) => {
            if (lang === DEFAULT_LANGUAGE) return null
            return {
              fieldset: 'titleFieldsetTranslations',
              type: 'string',
              group: 'basicInformation',
              name: `${lang}Title`,
              title: `Title (${lang.toUpperCase()})`,
            }
          })
          .filter(Boolean),
      ]
    }
  }

  const groups = [
    {
      name: 'basicInformation',
      title: 'Basic Information',
      default: true,
    },
    ...additionalGroups,
    {
      name: 'metadata',
      title: 'Metadata',
    },
  ]

  const fieldsets = []
  if (hasTitleTranslationFields) {
    fieldsets.push({
      name: 'titleFieldsetTranslations',
      title: 'Title (Translations)',
      options: {
        collapsible: true,
        collapsed: true,
      },
    })
  }

  return {
    name,
    title,
    type: 'document',
    groups,
    fieldsets,
    preview: {
      select: {
        title: `${DEFAULT_LANGUAGE}Title`,
        slug: 'slug.current',
      },
      prepare({title, slug}: {title: string; slug: string}) {
        let subtitle = ''

        switch (name) {
          case 'page':
            subtitle = `/[language]/${slug}`
            if (slug === LOCATION_HOME_SLUG) {
              subtitle = `/[language]`
            }
            if (slug === 'home') {
              subtitle = `/`
            }
            break
          case 'blogPost':
            subtitle = `/[lang]/blog/${slug}`
            break
          case 'caseStudy':
            subtitle = `/[lang]/case-study/${slug}`
            break
          default:
            break
        }

        return {
          title,
          subtitle,
        }
      },
    },
    initialValue: {
      ...getInitialValueFields(),
    },
    fields: [
      {
        name: 'isEnabled',
        title: 'Is Enabled',
        type: 'array',
        group: 'basicInformation',
        of: [
          {
            type: 'string',
          },
        ],
        components: {
          input: LanguageGridSelect,
        },
        initialValue: Object.values(LANGUAGES),
        options: {
          list: [
            ...Object.values(LANGUAGES).map((lang) => {
              return {
                title: `${lang.toUpperCase()}`,
                value: lang,
              }
            }),
          ],
        },
      },
      ...getTitleFields(),
      {
        name: 'slug',
        title: 'Slug', //
        type: 'slug',
        group: 'basicInformation',
        description: 'This is for generating a unique ID. Please do not edit without intention.',
        options: {
          source: (_: SanityDocument, context: {parent: {[key: string]: {title: string}}}) => {
            if (!context?.parent[`${DEFAULT_LANGUAGE}Title`]) return ''
            return context?.parent[`${DEFAULT_LANGUAGE}Title`]
          },
        },
        validation: (Rule: Rule) => Rule.required(),
      },
      getMetadataByLocales(),
      ...extraFields,
    ],
  }
}

const page = getPageSchema({
  name: 'page',
  title: 'Page',
  extraFields: [getSectionsByLocales({})],
  hasTitleTranslationFields: true,
  additionalGroups: [
    {
      name: 'content',
      title: 'Content',
    },
  ],
})

const blogPost = getPageSchema({
  name: 'blogPost',
  title: 'Blog Post',
  additionalGroups: [
    {
      name: 'content',
      title: 'Content',
    },
  ],
  extraFields: [
    getSectionsByLocales({
      whitelistSections: [
        'quote',
        'richTextSection',
        'imageBlocks',
        'introText',
        'expandingCarousel',
      ],
      group: 'content',
    }),
    {
      type: 'object',
      name: 'blogPostData',
      title: 'Blog Post Content',
      group: 'basicInformation',
      options: {
        collapsible: true,
      },
      fields: [
        ...generateFieldsByLanguage({
          titleSuffix: '',
          parentName: 'blogPostData',
          nameSuffix: 'BlogPostData',
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
                type: 'date',
                name: 'publishedDate',
                title: 'Published Date',
                validation: (Rule: Rule) =>
                  Rule.custom((_: any, context: any) => {
                    if (
                      !context?.parent?.publishedDate &&
                      context?.parent?.lang === DEFAULT_LANGUAGE
                    ) {
                      return 'Required'
                    }
                    return true
                  }),
              },
              {
                name: 'blogCategories',
                title: 'Blog Categories',
                type: 'array',
                of: [
                  {
                    type: 'reference',
                    to: [{type: 'blogCategory'}],
                  },
                ],
              },
              {
                name: 'blogReferences',
                title: 'Blog References',
                type: 'array',
                of: [
                  {
                    type: 'reference',
                    to: [{type: 'blogReference'}],
                  },
                ],
              },
              {
                type: 'text',
                name: 'summary',
                rows: 3,
              },
              {
                type: 'reference',
                name: 'author',
                title: 'Author',
                to: [{type: 'person'}],
              },
              {
                type: 'imageAsset',
                name: 'image',
                description: 'Image should be at least 2500px in width.',
                options: {
                  collapsible: true,
                  collapsed: false,
                },
                validation: (Rule: Rule) => {
                  const validation = Rule.custom((value, context) => {
                    if (value && context?.parent?.lang === DEFAULT_LANGUAGE) {
                      return getImageValidation({
                        image: value,
                        required: true,
                        minWidth: 2500,
                      })
                    }
                    return true
                  })
                  return validation
                },
              },
              {
                type: 'boolean',
                name: 'disableFromNewsFeed',
                title: 'Disable from News Feed',
                description: 'If enabled, this blog post will not be displayed in news feeds.',
                initialValue: false,
              },
            ]
          },
        }),
      ],
    },
  ],
})

const caseStudy = getPageSchema({
  name: 'caseStudy',
  title: 'Case Study',
  additionalGroups: [
    {
      name: 'content',
      title: 'Content',
    },
  ],
  extraFields: [
    getSectionsByLocales({
      whitelistSections: [
        'quote',
        'richTextSection',
        'imageBlocks',
        'introText',
        'expandingCarousel',
        'bigMedia',
      ],
      group: 'content',
    }),
    {
      type: 'object',
      name: 'caseStudyData',
      title: 'Blog Post Content',
      group: 'basicInformation',
      options: {
        collapsible: true,
      },
      fields: [
        ...generateFieldsByLanguage({
          titleSuffix: '',
          parentName: 'caseStudyData',
          nameSuffix: 'CaseStudyData',
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
                type: 'date',
                name: 'publishedDate',
                title: 'Published Date',
                validation: (Rule: Rule) =>
                  Rule.custom((_: any, context: any) => {
                    if (
                      !context?.parent?.publishedDate &&
                      context?.parent?.lang === DEFAULT_LANGUAGE
                    ) {
                      return 'Required'
                    }
                    return true
                  }),
              },
              {
                type: 'text',
                name: 'summary',
                rows: 3,
              },
              {
                type: 'imageAsset',
                name: 'image',
                options: {
                  collapsible: true,
                  collapsed: false,
                },
                validation: (Rule: Rule) => {
                  const validation = Rule.custom((value, context) => {
                    if (value && context?.parent?.lang === DEFAULT_LANGUAGE) {
                      return getImageValidation({
                        image: value,
                        required: true,
                        minWidth: 2500,
                      })
                    }
                    return true
                  })
                  return validation
                },
              },
              {
                name: 'factsDescription',
                type: 'array',
                of: [factsListDescriptionFields],
              },
              {
                name: 'location',
                type: 'string',
              },
              {
                name: 'country',
                type: 'string',
              },
              {
                name: 'transactionYear',
                type: 'string',
              },
              {
                name: 'sector',
                type: 'string',
              },
              {
                name: 'type',
                type: 'string',
              },
              {
                name: 'size',
                type: 'string',
              },
            ]
          },
        }),
      ],
    },
  ],
})

const exports = {page, blogPost, caseStudy}

export default exports
