/* eslint-disable */

export const getRichTextFields = ({
  items = [],
  customAnnotations = [],
}: {
  items?: (
    | 'bullet'
    | 'numberedList'
    | 'strong'
    | 'italic'
    | 'link'
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'heading4'
    // | 'blockquote'
    | 'small'
  )[]
  customAnnotations?: any[]
} = {}) => {
  const obj: any = {
    type: 'block',
    styles: [],
    marks: {
      annotations: [],
      decorators: [],
    },
    lists: [],
  }

  obj.styles.push({title: 'Normal', value: 'normal'})

  if (items.includes('heading1')) {
    obj.styles.push({title: 'Heading 1', value: 'h1'})
  }

  if (items.includes('heading2')) {
    obj.styles.push({title: 'Heading 2', value: 'h2'})
  }

  if (items.includes('heading3')) {
    obj.styles.push({title: 'Heading 3', value: 'h3'})
  }

  if (items.includes('heading4')) {
    obj.styles.push({title: 'Heading 4', value: 'h4'})
  }

  if (items.includes('bullet')) {
    obj.lists.push({title: 'Bullet', value: 'bullet'})
  }

  if (items.includes('numberedList')) {
    obj.lists.push({title: 'Numbered', value: 'number'})
  }

  if (items.includes('italic')) {
    obj.marks.decorators.push({title: 'Italic', value: 'em'})
  }

  if (items.includes('strong')) {
    obj.marks.decorators.push({title: 'Strong', value: 'strong'})
  }

  // if (items.includes('blockquote')) {
  //   obj.blocks.push({title: 'Blockquote', value: 'blockquote'})
  // }

  if (items.includes('small')) {
    obj.marks.decorators.push({
      title: 'Small',
      value: 'small',
      icon: () => <span>🤏</span>,
      component: ({children}: {children: React.ReactNode}) => <small>{children}</small>,
    })
  }

  if (items.includes('link')) {
    obj.marks.annotations.push({
      name: 'link',
      type: 'linkNoLabel',
      title: 'Link',
    })
  }

  if (customAnnotations) {
    customAnnotations.forEach((annotation) => {
      obj.marks.annotations.push(annotation)
    })
  }

  return obj
}

export const portableTextToString = (portableText: any, cap = 100) => {
  const plainText =
    portableText &&
    portableText
      .filter((block: any) => block._type === 'block')
      .map((block: any) => block.children.map((child: any) => child.text).join(''))
      .join(' ')
      .slice(0, cap)

  return plainText
}

export default getRichTextFields
