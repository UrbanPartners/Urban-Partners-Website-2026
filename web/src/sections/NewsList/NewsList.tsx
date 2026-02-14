'use client'

import { useMemo, useState, useCallback } from 'react'
import classnames from 'classnames'
import styles from './NewsList.module.scss'
import NewsCard from '@/components/NewsCard/NewsCard'
import NewsCardHorizontal from '@/components/NewsCardHorizontal/NewsCardHorizontal'
import LineAnimation from '@/components/LineAnimation/LineAnimation'
import SplitTextComponent from '@/components/SplitTextComponent/SplitTextComponent'
import { PAGINATION_ITEMS_PER_PAGE } from '@/data'
import TextAndIconButton from '@/components/TextAndIconButton/TextAndIconButton'
import useStickyTop from '@/hooks/use-sticky-top'
import useBreakpoint from '@/hooks/use-breakpoint'

const ITEMS_PER_VARIANT_MAP = {
  a: Math.floor(PAGINATION_ITEMS_PER_PAGE / 2),
  b: PAGINATION_ITEMS_PER_PAGE,
}

const NewsList = ({ className, variant, title, offsetPosts, items, totalItems }: SanityNewsList) => {
  const [isLoading, setIsLoading] = useState(false)
  const initialItems = useMemo(() => {
    if (!items || items.length === 0) return []
    const perVariant = ITEMS_PER_VARIANT_MAP[variant]
    if (!perVariant) {
      console.warn(`Invalid variant: ${variant}, using all items`)
      return items
    }

    let startIndex = 0
    if (offsetPosts && variant === 'b') {
      startIndex = ITEMS_PER_VARIANT_MAP.a
    }

    const endIndex = startIndex + perVariant
    return items.slice(startIndex, endIndex)
  }, [items, variant, offsetPosts])
  const [paginatedItems, setPaginatedItems] = useState<SanityNewsListItem[]>(initialItems)
  const initialOffset = offsetPosts && variant === 'b' ? ITEMS_PER_VARIANT_MAP.a : 0
  const itemLengthWithOffset = initialOffset + paginatedItems.length
  const hasMore = itemLengthWithOffset < totalItems

  const fetchMoreContent = useCallback(
    async (offset: number, perPage: number) => {
      if (isLoading) return

      setIsLoading(true)
      try {
        const response = await fetch('/api/paginatedBlogPosts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            offset,
            perPage,
          }),
        })

        const data = await response.json()

        if (data.success && data.results) {
          setPaginatedItems(prev => [...prev, ...data.results])
        }
      } catch (error) {
        console.error('Error fetching more content:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading],
  )

  const handleLoadMore = () => {
    // Calculate next offset: initialOffset + number of items already loaded
    const nextOffset = initialOffset + paginatedItems.length
    fetchMoreContent(nextOffset, ITEMS_PER_VARIANT_MAP[variant])
  }

  return (
    <div
      className={classnames(styles.NewsList, className)}
      data-news-list-variant={variant}
    >
      <div className={styles.inner}>
        {variant === 'a' && (
          <VariantAList
            items={paginatedItems}
            title={title}
            hasMore={hasMore}
            handleLoadMore={handleLoadMore}
            isLoading={isLoading}
          />
        )}
        {variant === 'b' && (
          <VariantBList
            items={paginatedItems}
            title={title}
            isLoading={isLoading}
            hasMore={hasMore}
            handleLoadMore={handleLoadMore}
          />
        )}
      </div>
    </div>
  )
}

NewsList.displayName = 'NewsList'

type VariantListProps = {
  items: SanityNewsListItem[]
  title: string
  hasMore: boolean
  handleLoadMore: () => void
  isLoading: boolean
}

const VariantAList = ({ items, title }: VariantListProps) => {
  const { setStickyElement, setStickyElementParent } = useStickyTop()
  const { isMobile } = useBreakpoint()

  return (
    <div
      className={styles.variantAContainer}
      ref={setStickyElementParent}
    >
      <LineAnimation
        startFull
        position="top"
        animateFrom="left"
        className={styles.variantAContainer__line}
      />
      <div
        className={styles.variantAContainer__titleContainer}
        ref={setStickyElement}
      >
        <SplitTextComponent animateInView>
          <p className={styles.variantAContainer__title}>{title}</p>
        </SplitTextComponent>
      </div>
      <div className={styles.variantAContainer__grid}>
        {items.map(item => (
          <NewsCard
            key={item._id}
            publishedDate={item.publishedDate || ''}
            slug={item.slug}
            image={item.image}
            title={item.title}
            className={styles.variantAItem}
          />
        ))}
        {items.length % 2 !== 0 && !isMobile && <div className={styles.variantAItem} />}
      </div>
    </div>
  )
}

const VariantBList = ({ items, title, isLoading, hasMore, handleLoadMore }: VariantListProps) => {
  return (
    <div className={styles.variantBContainer}>
      <LineAnimation
        position="top"
        animateFrom="left"
        animateInView
        longerDuration
        className={styles.variantBContainer__line}
      />
      <div className={styles.variantBContainer__titleContainer}>
        <SplitTextComponent animateInView>
          <p className={styles.variantBContainer__title}>{title}</p>
        </SplitTextComponent>
      </div>
      <div className={styles.variantBContainer__grid}>
        {items.map(item => (
          <NewsCardHorizontal
            key={item._id}
            title={item.title}
            slug={item.slug}
            publishedDate={item.publishedDate}
          />
        ))}
      </div>
      {hasMore && (
        <div className={styles.variantBContainer__loadMoreContainer}>
          <TextAndIconButton
            onClick={handleLoadMore}
            disabled={isLoading}
            className={styles.variantBContainer__loadMore}
            icon="arrowDown"
            label="Load More"
          />
        </div>
      )}
    </div>
  )
}

export default NewsList
