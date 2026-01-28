import {SearchIcon, AddIcon} from '@sanity/icons'
import {Box, TextInput, Tree, Button, Flex} from '@sanity/ui'
import React, {forwardRef, useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {useRouterState, useRouter} from 'sanity/router'
import {v4 as uuidv4} from 'uuid'

import {Page} from './PagesTreeView.types'
import {TreeItemComponent} from './TreeItemComponent'
import {buildTree} from './utils'

export const PagesTreeView = forwardRef<HTMLDivElement>(function PagesTreeView(_props, ref) {
  const [pages, setPages] = React.useState<Page[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [creatingPage, setCreatingPage] = useState(false)
  const client = useClient({apiVersion: '2024-05-01'})
  const router = useRouter()
  const routerState = useRouterState() as {panes?: {id?: string}[][]}
  const selectedDocumentId = routerState.panes?.[routerState.panes.length - 1]?.[0]?.id
    ?.replace('drafts.', '')
    .replace('__edit__', '')

  useEffect(() => {
    async function fetchPages() {
      const fetchedPages: {
        _id: string
        title: string
        slug: string
        _updatedAt: string
      }[] = await client.fetch(
        `*[_type == "page"] { _id, title, "slug": slug.current, _updatedAt }`,
      )

      const pagesData = new Map<string, {draft?: any; published?: any}>()

      for (const page of fetchedPages) {
        const isDraft = page._id.startsWith('drafts.')
        const id = isDraft ? page._id.substring(7) : page._id

        if (!pagesData.has(id)) {
          pagesData.set(id, {})
        }

        if (isDraft) {
          pagesData.get(id)!.draft = page
        } else {
          pagesData.get(id)!.published = page
        }
      }

      const newPages: Page[] = []
      for (const [id, {draft, published}] of pagesData.entries()) {
        const pageData = draft || published
        if (!pageData) continue

        let status: 'published' | 'draft' | 'changed'
        if (draft && published) {
          status = 'changed'
        } else if (draft) {
          status = 'draft'
        } else {
          status = 'published'
        }

        newPages.push({
          _id: id,
          title: pageData.title,
          slug: pageData.slug,
          status,
          publishedAt: published?._updatedAt,
          draftUpdatedAt: draft?._updatedAt,
        })
      }
      setPages(newPages)
    }

    fetchPages()

    const subscription = client.listen(`*[_type == "page"]`).subscribe(() => {
      fetchPages()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [client])

  const filteredPages = useMemo(() => {
    if (!searchQuery) {
      return pages
    }
    return pages.filter(
      (page) =>
        page.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.slug?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [pages, searchQuery])

  const rootNode = useMemo(() => buildTree(filteredPages), [filteredPages])
  const children = useMemo(() => Array.from(rootNode.children.values()), [rootNode.children])

  const handleCreateNewPage = async () => {
    if (creatingPage) return
    setCreatingPage(true)
    try {
      // Navigate to create a new page in a new pane
      router.navigateIntent('create', {type: 'page'})
    } catch (error) {
      console.error('Error navigating to create page:', error)
    } finally {
      setCreatingPage(false)
    }
  }

  return (
    <Box
      ref={ref}
      paddingLeft={2}
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      <Box style={{flexShrink: 0, flexGrow: 0}} paddingRight={3}>
        <Flex gap={2} align="center">
          <Box flex={1}>
            <TextInput
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              placeholder="Search pages"
              value={searchQuery}
              icon={SearchIcon}
            />
          </Box>
          <Button
            disabled={creatingPage}
            icon={AddIcon}
            mode="ghost"
            text="New Page"
            onClick={handleCreateNewPage}
          />
        </Flex>
      </Box>
      <Box paddingTop={3} style={{flexGrow: 1, overflow: 'auto'}}>
        <Tree space={1}>
          {rootNode.pages.length > 0 && (
            <TreeItemComponent node={rootNode} selectedId={selectedDocumentId} />
          )}
          {children.map((child) => (
            <TreeItemComponent key={child.id} node={child} selectedId={selectedDocumentId} />
          ))}
        </Tree>
      </Box>
    </Box>
  )
})
