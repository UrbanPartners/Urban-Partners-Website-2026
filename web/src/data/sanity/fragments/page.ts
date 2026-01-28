import sections from './sections'
import { pageMetadataFields } from './_shared'
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/data'
import renderSections from '@/data/sanity/fragments/renderSections'

/* eslint-disable */

export const getFields = () => {
  return `
    ${pageMetadataFields},
    "sections": select(
      ${Object.values(LANGUAGES)
        .map(
          lang => `$language == "${lang}" => coalesce(sections.${lang}Sections, sections.${DEFAULT_LANGUAGE}Sections),`,
        )
        .join('')}
    )[]  {
      ${renderSections.fields}
    }
  `
}

export const getMinimalFields = () => {
  return `
    ${pageMetadataFields}
  `
}

/* eslint-enable */

export const getSections = () => {
  return `
    ${sections.fragment('sections')}   
  `
}

const exported = {
  getFields,
  getSections,
}

export default exported
