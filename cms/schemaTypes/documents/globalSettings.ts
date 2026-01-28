import {Rule} from 'sanity'
import {DEFAULT_LANGUAGE, LANGUAGES} from '../../data/languages'
import {generateMetadataFields} from '../objects/metadata'

const NAVIGATION_LINK_OBJECT = {
  type: 'object',
  preview: {
    select: {
      title: 'link.label',
    },
    prepare(selection: any) {
      const {title} = selection
      return {title}
    },
  },
  fields: [
    {
      name: 'link',
      type: 'link',
    },
    {
      name: 'hasArrow',
      title: 'Has Arrow',
      type: 'boolean',
      initialValue: false,
    },
  ],
}

const NAVIGATION_LINK_VALIDATION = (Rule: Rule) =>
  Rule.custom((value: any, context: any) => {
    const totalHeaderLinks =
      context?.parent?.headerLinksLeftSide?.length + context?.parent?.headerLinksRightSide?.length
    if (totalHeaderLinks > 6) {
      return 'You can only add up to 6 links total (left and right side combined)'
    }
    return true
  })
export default {
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  groups: [
    ...Object.values(LANGUAGES).map((lang) => {
      return {
        name: `${lang}`,
        title: `${lang.toUpperCase()} Settings`,
        default: lang === DEFAULT_LANGUAGE,
      }
    }),
  ],
  fields: [
    /*

    Navigation

    */
    ...Object.values(LANGUAGES).map((lang) => {
      return {
        name: `${lang}NavigationSettings`,
        title: `${lang.toUpperCase()} Navigation Settings`,
        type: 'object',
        group: `${lang}`,
        options: {
          collapsible: true,
          // collapsed: true,
        },
        fields: [
          {
            type: 'array',
            name: 'headerLinksLeftSide',
            title: 'Header Links (Left Side)',
            of: [NAVIGATION_LINK_OBJECT],
            validation: NAVIGATION_LINK_VALIDATION,
          },
          {
            type: 'array',
            name: 'headerLinksRightSide',
            title: 'Header Links (Right Side)',
            of: [NAVIGATION_LINK_OBJECT],
            validation: NAVIGATION_LINK_VALIDATION,
          },
        ],
      }
    }),
    /*

    Menu

    */
    ...Object.values(LANGUAGES).map((lang) => {
      return {
        name: `${lang}MenuSettings`,
        title: `${lang.toUpperCase()} Menu Settings`,
        type: 'object',
        group: `${lang}`,
        options: {
          collapsible: true,
          // collapsed: true,
        },
        fields: [
          {
            type: 'array',
            name: 'secondaryLinks',
            title: 'Secondary Link',
            of: [{type: 'link'}],
            validation: (Rule: Rule) => Rule.required().min(1).max(4),
          },
          {
            type: 'array',
            name: 'sideLinks',
            title: 'Side Links',
            of: [{type: 'link'}],
            validation: (Rule: Rule) => Rule.required().min(1).max(2),
          },
          {
            type: 'array',
            name: 'legalLinks',
            title: 'Legal Links',
            of: [{type: 'link'}],
            validation: (Rule: Rule) => Rule.required().min(1).max(3),
          },
          {
            type: 'text',
            rows: 2,
            name: 'legalText',
            validation: (Rule: Rule) => Rule.required(),
          },
        ],
      }
    }),
    /*

    Metadata

    */
    ...Object.values(LANGUAGES).map((lang) => {
      return {
        name: `${lang}SiteSettingsMetadata`,
        title: `${lang.toUpperCase()} Site Settings Metadata`,
        type: 'object',
        group: `${lang}`,
        options: {
          collapsible: true,
          // collapsed: true,
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
    }),
    /*

    Preloader

    */
    ...Object.values(LANGUAGES).map((lang) => {
      return {
        name: `${lang}PreloaderSettings`,
        title: `${lang.toUpperCase()} Preloader Settings`,
        type: 'object',
        group: `${lang}`,
        options: {
          collapsible: true,
          // collapsed: true,
        },
        fields: [
          {
            type: 'array',
            name: 'rotatingTexts',
            description: 'Must have exactly 7 texts',
            of: [{type: 'string'}],
            validation: (Rule: Rule) => Rule.required().min(7).max(7),
          },
          {
            type: 'string',
            name: 'rotatingTextSuffix',
            description: 'ie invest "for tomorrow"',
            validation: (Rule: Rule) => Rule.required(),
          },
        ],
      }
    }),
  ],
}
