import { groq } from 'next-sanity'
import cmsSettings from '../cmsSettings'
import { getRichTextFields } from '@/data/sanity/utils'
import link from '../link'
import { imageAsset, mediaAsset } from '@/data/sanity/fragments'

export const fields = groq`
  _type,
  _id,
  ${cmsSettings()},
  introSection {
    title,
    subtitle,
    description[] {${getRichTextFields({})}},
    caseStudyListDescription[] {${getRichTextFields({})}},
    caseStudyItems[] {
      _key,
      title,
      description,
      image {${imageAsset.fields}},
      imageOverlayOpacity,
      cta {${link.fields}},
    },
  },
  timelineSection {
    yearPrefix,
    subtitle,
    itemsByYear[] {
      _key,
      yearSuffix,
      items[] {
        _key,
        image {${imageAsset.fields}},
        title,
        description[] {${getRichTextFields({})}},
        "imageLayout": coalesce(imageLayout, "portrait"),
      },
    },
  },
  locationsSection {
    title,
    description[] {${getRichTextFields({})}},
    cta {${link.fields}},
    locations[] {
      _key,
      title,
      image {${imageAsset.fields}},
    },
  },
  mediaSection {
    title,
    description,
    ${imageAsset.fragment('backgroundImage')},
    "backgroundImageOverlay": coalesce(backgroundImageOverlay, 40),
    ${mediaAsset.fragment('media')},
  },
`

export const fragment = (name = 'ourStoryScroller') => `${name}{ ${fields} }`

const exported = {
  fields,
  fragment,
}

export default exported
