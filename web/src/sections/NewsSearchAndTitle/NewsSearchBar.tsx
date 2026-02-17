'use client'

import { useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from 'react'
import classnames from 'classnames'
import styles from './NewsSearchBar.module.scss'
import FormElement from '@/components/FormElement/FormElement'
import { FormElementImperativeHandle } from '@/types/components/FormElement'
import NewsCardHorizontal from '@/components/NewsCardHorizontal/NewsCardHorizontal'
import useI18n from '@/hooks/use-i18n'
import FadeIn from '@/components/FadeIn/FadeIn'
import { ScrollContext } from '@/context/Scroll'
import useBreakpoint from '@/hooks/use-breakpoint'

interface NewsSearchBarProps {
  blogCategories?: SanityBlogCategory[]
  blogReferences?: SanityBlogReference[]
  className?: string
  hideDropdowns?: boolean
}

const NewsSearchBar = ({ className, blogCategories, blogReferences, hideDropdowns }: NewsSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBlogCategory, setSelectedBlogCategory] = useState('')
  const [selectedBlogReference, setSelectedBlogReference] = useState('')
  const inputRef = useRef<FormElementImperativeHandle>(null)
  const debouncedSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllersRef = useRef<AbortController[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<SanityCard[]>([])
  const { scroll } = useContext(ScrollContext)
  const resultsRef = useRef<ResultsRef>(null)
  const { isMobile } = useBreakpoint()
  const { i18n } = useI18n()

  const selectedBlogReferenceTitle = useMemo(() => {
    return blogReferences?.find(reference => reference._id === selectedBlogReference)?.title || ''
  }, [blogReferences, selectedBlogReference])

  const selectedBlogCategoryTitle = useMemo(() => {
    return blogCategories?.find(category => category._id === selectedBlogCategory)?.title || ''
  }, [blogCategories, selectedBlogCategory])

  const handleSubmit = useCallback(
    ({
      searchTerm,
      selectedBlogCategory,
      selectedBlogReference,
    }: {
      searchTerm: string
      selectedBlogCategory: string
      selectedBlogReference: string
    }) => {
      if (!searchTerm?.length && !selectedBlogCategory?.length && !selectedBlogReference?.length) {
        return
      }

      const abortController = new AbortController()
      abortControllersRef.current.push(abortController)

      let signal: AbortSignal | undefined
      if (abortControllersRef.current.length) {
        signal = abortControllersRef.current[abortControllersRef.current.length - 1].signal
      }

      setIsLoading(true)

      const requestBody = {
        searchTerm: searchTerm || undefined,
        blogCategory: selectedBlogCategory || undefined,
        blogReference: selectedBlogReference || undefined,
      }

      fetch('/api/newsSearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal,
      })
        .then(response => response.json())
        .then(data => {
          setItems(data.results)

          if (data.results.length > 0) {
            if (resultsRef.current && scroll) {
              const container = resultsRef.current.getResultsContainer()
              if (container && isMobile) {
                scroll.scrollTo(container)
              }
            }
          }
        })
        .catch(error => {
          if (error.name !== 'AbortError') {
            console.error('Error searching news:', error)
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [scroll, isMobile],
  )

  useEffect(() => {
    if (debouncedSearchTimeoutRef.current) {
      clearTimeout(debouncedSearchTimeoutRef.current)
    }

    if (!searchTerm?.length && !selectedBlogCategory?.length && !selectedBlogReference?.length) {
      setItems([])
    }

    abortControllersRef.current.forEach(abortController => {
      abortController.abort()
    })

    abortControllersRef.current = []

    if (!searchTerm?.length && !selectedBlogCategory?.length && !selectedBlogReference?.length) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }

    debouncedSearchTimeoutRef.current = setTimeout(() => {
      handleSubmit({
        searchTerm,
        selectedBlogCategory,
        selectedBlogReference,
      })
    }, 200)
  }, [searchTerm, handleSubmit, selectedBlogCategory, selectedBlogReference])

  const categoryOptions = useMemo(() => {
    if (!blogCategories?.length) return []

    const arr = [{ label: 'All', value: '' }]
    const asItems = blogCategories.map(category => ({
      label: category.title || 'Untitled Category',
      value: category._id,
    }))

    return arr.concat(asItems)
  }, [blogCategories])

  const referenceOptions = useMemo(() => {
    if (!blogReferences?.length) return []

    const arr = [{ label: 'All', value: '' }]
    const asItems = blogReferences.map(reference => ({
      label: reference.title || 'Untitled Reference',
      value: reference._id,
    }))

    return arr.concat(asItems)
  }, [blogReferences])

  return (
    <FadeIn
      animateInView
      inConfig={{
        delay: 0.6,
      }}
    >
      <form
        onSubmit={e => {
          e.preventDefault()
        }}
        className={classnames(styles.NewsSearchBar, className, {
          [styles.hideDropdowns]: hideDropdowns,
        })}
      >
        <FormElement
          ref={inputRef}
          element="input"
          type="text"
          name="search"
          placeholder="Search"
          buttonIcon={searchTerm?.length ? 'x' : 'magnifyingGlass'}
          buttonOnClick={() => {
            if (searchTerm?.length) {
              setSearchTerm('')
              inputRef.current?.setCurrentValue('')
              const container = inputRef.current?.getContainerRef()
              const input = container?.querySelector('input')
              if (input) {
                input.focus()
              }
            }
          }}
          onChange={(value: string) => {
            setSearchTerm(value)
          }}
          className={styles.searchInput}
        />
        {!hideDropdowns && (
          <>
            <FormElement
              element="select"
              name="category"
              label={i18n('category')}
              items={categoryOptions}
              onChange={(value: string) => {
                setSelectedBlogCategory(value)
              }}
              className={styles.categorySelect}
            />
            <FormElement
              element="select"
              name="reference"
              label={i18n('type')}
              items={referenceOptions}
              onChange={(value: string) => {
                setSelectedBlogReference(value)
              }}
              className={styles.referenceSelect}
            />
          </>
        )}
      </form>
      <Results
        ref={resultsRef}
        items={items}
        searchTerm={searchTerm}
        selectedBlogCategory={selectedBlogCategoryTitle}
        selectedBlogReference={selectedBlogReferenceTitle}
        isLoading={isLoading}
      />
    </FadeIn>
  )
}

NewsSearchBar.displayName = 'NewsSearchBar'

export interface ResultsRef {
  getResultsContainer: () => HTMLDivElement | null
}

const Results = forwardRef<
  ResultsRef,
  {
    items: SanityCard[]
    searchTerm: string
    selectedBlogCategory: string
    selectedBlogReference: string
    isLoading: boolean
  }
>(({ items, searchTerm, selectedBlogCategory, selectedBlogReference, isLoading }, ref) => {
  const { i18n } = useI18n()
  const hasResultsText = Boolean(searchTerm?.length || selectedBlogCategory?.length || selectedBlogReference?.length)
  const resultsHeaderRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getResultsContainer: () => resultsHeaderRef.current,
  }))

  return (
    <div className={classnames(styles.Results, { [styles.loading]: isLoading })}>
      {hasResultsText && (
        <div
          className={styles.results__header}
          ref={resultsHeaderRef}
        >
          <div className={styles.results__headerTextList}>
            {!!searchTerm?.length && (
              <p className={styles.results__headerTextPrimary}>{i18n('resultsForTerm', { term: searchTerm })}</p>
            )}
            {selectedBlogCategory && (
              <p
                className={classnames(styles.results__headerTextSecondary, {
                  [styles.big]: !searchTerm?.length && !selectedBlogReference,
                })}
              >
                {i18n('resultsForCategory', { category: selectedBlogCategory })}
              </p>
            )}
            {selectedBlogReference && (
              <p
                className={classnames(styles.results__headerTextSecondary, {
                  [styles.big]: !searchTerm?.length && !selectedBlogCategory,
                })}
              >
                {i18n('resultsForReference', { reference: selectedBlogReference })}
              </p>
            )}
          </div>

          <div className={styles.results__loadingContainer}>
            <NewsSearchBarLoading />
            <p className={styles.results__count}>{i18n('numberOfArticles', { count: items.length })}</p>
          </div>
        </div>
      )}

      <div className={styles.results__grid}>
        {items.map((item, index) => (
          <NewsCardHorizontal
            key={`${item.title}_${index}`}
            title={item.title}
            slug={item.slug}
            publishedDate={item.publishedDate}
          />
        ))}
      </div>
    </div>
  )
})

Results.displayName = 'Results'

const NewsSearchBarLoading = () => {
  return (
    <svg
      className={styles.results__loadingIcon}
      viewBox="0 0 780 788"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M393.008 787.406C308.492 787.406 226.592 760.322 157.742 708.769C73.5918 645.741 19.0008 553.66 4.06677 449.569C-10.8672 345.45 15.6258 241.753 78.6548 157.575C208.817 -16.2374 456.093 -51.6754 629.849 78.4026C702.693 132.965 754.668 211.631 776.24 299.887C779.924 314.99 770.671 330.206 755.596 333.89C740.521 337.462 725.277 328.349 721.593 313.246C703.143 237.618 658.593 170.202 596.127 123.43C447.261 11.9136 235.283 42.3176 123.683 191.296C69.6548 263.437 46.9578 352.312 59.7828 441.552C72.5798 530.793 119.38 609.683 191.52 663.683C340.526 775.339 552.476 744.88 664.02 595.902C693.214 556.893 713.239 513.186 723.476 465.964C726.795 450.776 741.842 441.13 756.917 444.42C772.105 447.711 781.751 462.701 778.461 477.861C766.452 533.042 743.108 584.061 709.048 629.623C646.02 713.773 553.939 768.392 449.792 783.298C430.808 786.054 411.851 787.404 393.008 787.404V787.406Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default NewsSearchBar
