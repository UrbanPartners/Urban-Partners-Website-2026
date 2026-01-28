import {Rule} from 'sanity'

export default {
  type: 'object',
  name: 'orgStructuredData',
  title: 'Organization Structured Data',
  fields: [
    {
      title: 'Company Title',
      name: 'companyTitle',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Company Description',
      name: 'companyDescription',
      type: 'text',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Image',
      name: 'image',
      type: 'image',
      description: 'Minimum 112x112, transparent PNG, should work on white background',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'addressInfo',
      title: 'Address Information',
      type: 'object',
      fields: [
        {
          title: 'Country',
          name: 'country',
          type: 'string',
          description: 'ie. "CA"',
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          title: 'Region',
          name: 'region',
          type: 'string',
          description: 'ie. "British Columbia"',
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          title: 'Locality',
          name: 'locality',
          type: 'string',
          description: 'ie. "Vancouver"',
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          title: 'Postal Code',
          name: 'postalCode',
          type: 'string',
          description: 'ie. "V6B 4X2"',
          validation: (Rule: Rule) => Rule.required(),
        },
        {
          title: 'Street Address',
          name: 'streetAddress',
          type: 'string',
          description: 'ie. "1152 Mainland St"',
          validation: (Rule: Rule) => Rule.required(),
        },
      ],
    },
    {
      title: 'Telephone',
      name: 'telephone',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Email',
      name: 'email',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Founding Date',
      name: 'foundingDate',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      title: 'Number of Employees',
      name: 'numberOfEmployees',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      type: 'array',
      name: 'otherLinks',
      title: 'Other Links',
      description: 'Put links to Instagram, LinkedIn etc',
      of: [{type: 'string'}],
    },
  ],
}
