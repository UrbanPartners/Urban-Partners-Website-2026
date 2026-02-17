import RedirectsNumberLeft from '../../components/RedirectsNumberLeft'

const fieldValidation = (value: string) => {
  // Array of non-URL allowed characters (for path segments)
  // This is a conservative set, not including reserved/unsafe characters in URLs
  const nonUrlAllowedChars = [
    ' ',
    '"',
    '<',
    '>',
    '`',
    '#',
    '%',
    '{',
    '}',
    '|',
    '\\',
    '^',
    '~',
    '[',
    ']',
    '`',
  ]

  // Detect if it contains any non-URL allowed characters
  const hasNonUrlAllowedChars = nonUrlAllowedChars.some((char) => value.includes(char))
  if (hasNonUrlAllowedChars) {
    return 'Source cannot contain any of the following characters: ' + nonUrlAllowedChars.join(', ')
  }

  // Detect if it contains a space
  if (value.includes(' ')) {
    return 'Source cannot contain a space'
  }

  // Detect if it contains a regular expression (e.g., '/feedback/(?!general)')
  const regexPattern = /(.*?)(\/\(([^)]+)\))/
  const match = value.match(regexPattern)
  if (match) {
    return 'Source cannot contain a regular expression'
  }

  // Detect if it contains a query param (e.g., '/feedback?type=general')
  const queryParamPattern = /\?.*$/
  const queryParamMatch = value.match(queryParamPattern)
  if (queryParamMatch) {
    return 'Source cannot contain a query param'
  }

  // Cannot contain ^
  if (value.includes('^')) {
    return 'Source cannot contain a ^'
  }

  // Cannot contain $
  if (value.includes('$')) {
    return 'Source cannot contain a $'
  }

  return null
}

export default {
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  preview: {
    select: {
      source: 'source',
      destination: 'destination',
      type: 'type',
    },
    prepare(selection: any) {
      const {source, destination, type} = selection
      return {
        title: `From: ${source} (${type})`,
        subtitle: `To: ${destination}`,
      }
    },
  },
  fields: [
    {
      name: 'numberOfRedirectsLeft',
      title: 'Number of Redirects Left',
      type: 'string', // or any type, it will be replaced visually
      components: {
        input: RedirectsNumberLeft,
      },
      readOnly: true,
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      validation: (Rule: any) =>
        Rule.custom((value: any, context: any) => {
          if (!value) {
            return 'This is required'
          }

          const validationResult = fieldValidation(value)
          if (validationResult) {
            return validationResult
          }

          if (!value.startsWith('/')) {
            return 'Source must start with a slash'
          }

          return true
        }),
    },
    {
      name: 'destination',
      title: 'Destination',
      type: 'string',
      validation: (Rule: any) =>
        Rule.custom((value: any, context: any) => {
          if (!value) {
            return 'This is required'
          }

          // Detect if doesnt start with / or http
          if (!value.startsWith('/') && !value.startsWith('http')) {
            return 'Destination must start with a slash or http'
          }

          return true
        }),
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      initialValue: 'permanent',
      options: {
        layout: 'radio',
        list: ['permanent', 'temporary'],
      },
    },
    {
      name: 'publishedDate',
      title: 'Published Date',
      type: 'datetime',
      initialValue: new Date().toISOString(),
    },
    {
      name: 'importedFromCraft',
      title: 'Imported From Craft',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}: {parent: any}) => !parent?.importedFromCraft,
      readOnly: true,
    },
  ],
}
