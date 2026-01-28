'use client'

import { PortableText, PortableTextReactComponents } from '@portabletext/react'
import Link from '@/components/Link/Link'
import styles from './RichText.module.scss'
import Icon from '@/components/Icon/Icon'

export const portableTextSerializer: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }) => <p data-p>{children}</p>,
    h1: ({ children }) => <h1 data-h1>{children}</h1>,
    h2: ({ children }) => <h2 data-h2>{children}</h2>,
    h3: ({ children }) => <h3 data-h3>{children}</h3>,
    h4: ({ children }) => <h4 data-h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote data-blockquote>{children}</blockquote>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li
        className={styles.li}
        data-li
      >
        {children}
      </li>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul
        className={styles.ul}
        data-ul
      >
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol
        className={styles.ol}
        data-ol
      >
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ value, text }) => {
      return (
        <Link
          link={{
            ...value,
            label: text,
          }}
        />
      )
    },
    span: ({ children }) => <span data-span>{children}</span>,
    small: ({ children }) => <small data-small>{children}</small>,
  },
  types: {
    richTextBlockquote: ({ value }) => (
      <div className={styles.blockquote}>
        <blockquote
          data-blockquote
          className={styles.blockquoteText}
        >
          <Icon
            name="quoteOpening"
            className={styles.blockquoteIcon}
          />
          {value.quote}
        </blockquote>
        {value.author && (
          <p
            data-blockquote-author
            className={styles.blockquoteAuthor}
          >
            {value.author}
          </p>
        )}
      </div>
    ),
  },
}

const RichText = ({ content, serializer }: SanityContentBlockProps) => {
  return (
    <PortableText
      value={content}
      onMissingComponent={false}
      components={serializer || portableTextSerializer}
    />
  )
}

RichText.displayName = 'RichText'

export default RichText
