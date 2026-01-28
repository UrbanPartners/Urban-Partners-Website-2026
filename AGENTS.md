# Project Instructions

## General

- Use the SanityImage everytime an imageAsset type is used. The only time next/image should be referenced should be within the SanityImage file
- anytime I reference a store basically anywhere, it should be the store in `import useStore from '@/store'`

## Schema files

- Schemas that have rich text should be added like the following example:

```
import {getRichTextFields} from '../../utils/richText'

...
fields: [
    {
      name: 'content',
      type: 'array',
      of: [
        getRichTextFields({
          items: [
            'link',
            'strong',
            'italic',
          ],
        }),
      ],
    },
]
```

## Fragment files

- All objects added to a schema should be used in fragment file as `${[objectName].fragment('nameOfField')},` or `nameOfField {${[objectName].fields}}` and imported at the top. These objects are found in web/src/data/sanity/fragments
- richText added in a schema through getRichTextFields(). For example `content[] {${getRichTextFields({})}},`. This function should be imported from `import { getRichTextFields } from '@/data/sanity/utils'`

## Type files

- Basic objects like SanityImage (imageAsset type) and SanityLink (link type) should be referenced vs manually dereferenced. For example:

```
type SanityQuote = SectionCMSInterface & {
  content?: SanityContentBlockProps[]
  authorImage?: SanityImage
  authorName: string
  authorDesignation?: string
}
```

- Rich Text content should be of type SanityContentBlockProps[]

## .scss files

- All mixins should be referenced from mixins.scss. Do not recommend mixins that do not exist
