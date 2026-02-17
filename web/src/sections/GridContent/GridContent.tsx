'use client'

import classnames from 'classnames'
import styles from './GridContent.module.scss'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import RichText from '@/components/RichText/RichText'
import { portableTextSerializer } from '@/components/RichText/RichText'
import { PortableTextReactComponents } from '@portabletext/react'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import FadeIn from '@/components/FadeIn/FadeIn'
import { useMemo } from 'react'
import useBreakpoint from '@/hooks/use-breakpoint'
import LineBreakElement from '@/components/LineBreakElement/LineBreakElement'

// Custom serializer for grid content
const GRID_CONTENT_SERIALIZER = {
  ...portableTextSerializer,
  block: {
    ...portableTextSerializer.block,
    h3: ({ children }) => {
      if (!children) return null

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let splitChildren: any = null
      if (Array.isArray(children)) {
        splitChildren = children
          .map(child => {
            if (typeof child === 'string') {
              return child.split(' ')
            }
            return child
          })
          .flat()
          .join('\n')
      }

      let isLongTitle = false
      if (typeof splitChildren === 'string') {
        isLongTitle = splitChildren.length > 7
      }

      return (
        <SplitTextComponent
          type="words"
          inConfig={{
            stagger: 0.035,
          }}
          animateInView
          className={classnames(styles.titleSplitText, {
            [styles.isLongTitle]: isLongTitle,
          })}
          // revertOnAnimateIn={false}
        >
          {typeof splitChildren === 'string' && isLongTitle ? (
            <>
              <LineBreakElement
                className={styles.titleText}
                text={splitChildren}
              />
            </>
          ) : (
            <h3
              data-h3
              className={styles.titleText}
            >
              {children}
            </h3>
          )}
        </SplitTextComponent>
      )
    },
    normal: ({ children }) => (
      <FadeIn
        element="span"
        animateInView
      >
        <span data-p>{children}</span>
      </FadeIn>
    ),
  },
  marks: {
    ...portableTextSerializer.marks,
    small: ({ children }) => (
      <FadeIn animateInView>
        <small data-small>{children}</small>
      </FadeIn>
    ),
  },
} as Partial<PortableTextReactComponents>

const GridContent = ({ className, firstRowColumns, items, caption }: SanityGridContent) => {
  const { isMobile } = useBreakpoint()

  const itemsCalculated = useMemo(() => {
    if (isMobile) {
      return items
    }

    if (caption) {
      const captionBlock = {
        _key: '0208c2322b8eac0c',
        content: [
          {
            _key: '61c22342375fae53a',
            _type: 'block',
            children: [
              {
                _key: 'ecfa2235235c51d62d',
                _type: 'span',
                marks: ['small'],
                text: caption,
              },
            ],
            level: null,
            listItem: null,
            markDefs: [],
            style: 'normal',
          },
        ],
      }

      return [captionBlock, ...(items || [])] as SanityGridContentItem[]
    }

    return items
  }, [items, caption, isMobile])

  if (!items?.length || !itemsCalculated?.length) {
    return null
  }

  // Split items into groups
  const groups: SanityGridContentItem[][] = []
  let currentIndex = 0

  // First group uses firstRowColumns
  if (itemsCalculated.length > 0) {
    groups.push(itemsCalculated.slice(0, firstRowColumns))
    currentIndex = firstRowColumns
  }

  // Remaining groups have 3 columns max
  while (currentIndex < itemsCalculated.length) {
    groups.push(itemsCalculated.slice(currentIndex, currentIndex + 3))
    currentIndex += 3
  }

  return (
    <div
      className={classnames(styles.GridContent, className)}
      data-grid-content-first-row-columns={firstRowColumns}
    >
      <LineAnimation
        position="top"
        animateFrom="left"
        animateInView
        longerDuration
      />
      <div className={styles.inner}>
        {groups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className={classnames(styles.group, {
              [styles.isFirstGroup]: groupIndex === 0,
              [styles.hasTwoColumns]: groupIndex === 0 && firstRowColumns === 2,
              [styles.hasThreeColumns]: groupIndex === 0 && firstRowColumns === 3,
            })}
          >
            {group.map((item, itemIndex) => {
              const isFirstInGroup = itemIndex === 0

              return (
                <div
                  key={item._key}
                  className={classnames(styles.item, {
                    [styles.isFirstRow]: groupIndex === 0,
                  })}
                >
                  {item.content && (
                    <div className={styles.content}>
                      <RichText
                        content={item.content}
                        serializer={GRID_CONTENT_SERIALIZER}
                      />
                    </div>
                  )}
                  {!isFirstInGroup && !isMobile && (
                    <LineAnimation
                      position="left"
                      animateFrom="top"
                      animateInView
                    />
                  )}
                  <LineAnimation
                    position="bottom"
                    animateFrom="left"
                    animateInView
                  />
                </div>
              )
            })}
          </div>
        ))}
        {isMobile && caption && (
          <FadeIn animateInView>
            <p className={styles.mobileCaption}>{caption}</p>
          </FadeIn>
        )}
      </div>
      {!isMobile && (
        <LineAnimation
          position="bottom"
          animateFrom="left"
          animateInView
          longerDuration
        />
      )}
    </div>
  )
}

GridContent.displayName = 'GridContent'

export default GridContent
