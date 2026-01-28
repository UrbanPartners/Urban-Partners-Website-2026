import {DocumentIcon} from '@sanity/icons'
import {Box, Flex, Stack, Text, TreeItem} from '@sanity/ui'
import React, {useEffect, useMemo, useState} from 'react'
import {PiFolder, PiFolderOpen} from 'react-icons/pi'
import {useRouter} from 'sanity/router'

import {StatusIndicator} from '../StatusIndicator'
import {Page, TreeNode} from './PagesTreeView.types'
import {formatEmptyFolderTitle} from './utils'

const hasSelectedDescendant = (n: TreeNode, id?: string): boolean => {
  if (!id) return false
  for (const child of n.children.values()) {
    if (child.pages.some((p) => p._id === id)) {
      return true
    }
    if (hasSelectedDescendant(child, id)) {
      return true
    }
  }
  return false
}

const TreeItemLabel = ({
  title,
  subtitle,
  page,
}: {
  title: string
  subtitle?: string
  page?: Page
}) => (
  <Flex align="center">
    <Box flex={1} paddingY={2}>
      <Stack space={[2]}>
        <Text size={1} weight="medium">
          {title}
        </Text>
        {subtitle && (
          <Text size={1} muted>
            {subtitle}
          </Text>
        )}
      </Stack>
    </Box>
    {page && (
      <StatusIndicator
        status={page.status}
        publishedAt={page.publishedAt}
        draftUpdatedAt={page.draftUpdatedAt}
      />
    )}
  </Flex>
)

export const TreeItemComponent = ({node, selectedId}: {node: TreeNode; selectedId?: string}) => {
  const router = useRouter()
  const [expanded, setExpanded] = useState(true)

  const children = useMemo(
    () =>
      Array.from(node.children.values()).sort((a, b) => {
        if (a.part === '__self__') return -1
        if (b.part === '__self__') return 1
        return a.part.localeCompare(b.part)
      }),
    [node.children],
  )

  const isSelected = useMemo(
    () => node.pages.some((page) => page._id === selectedId),
    [node.pages, selectedId],
  )

  const isChildSelected = useMemo(() => hasSelectedDescendant(node, selectedId), [node, selectedId])

  useEffect(() => {
    if (isChildSelected) {
      setExpanded(true)
    }
  }, [isChildSelected])

  const handlePageSelect = (page: Page) => {
    const {state} = router as unknown as {
      state: {
        panes: {
          id: string
          params?: {type: string}
        }[][]
      }
      navigate: (state: any) => void
    }

    state.panes[1] = [
      {
        id: `__edit__${page._id}`,
        params: {type: 'page'},
      },
    ]
    router.navigate({...state})
  }

  const handleFolderSelect = () => {
    setExpanded(!expanded)
  }

  if (node.pages.length > 1) {
    // Slug collision: a folder of pages
    const title = formatEmptyFolderTitle(node.part)
    const subtitle = `/${node.pages[0].slug || ''} (${node.pages.length} pages)`
    return (
      <TreeItem
        icon={expanded ? PiFolderOpen : PiFolder}
        expanded={expanded}
        onClick={handleFolderSelect}
        text={<TreeItemLabel title={title} subtitle={subtitle} />}
      >
        <Box paddingLeft={4}>
          {node.pages.map((page) => (
            <TreeItem
              key={page._id}
              icon={DocumentIcon}
              onClick={() => handlePageSelect(page)}
              selected={page._id === selectedId}
              text={
                <TreeItemLabel
                  title={page.title}
                  subtitle={page.slug ? `/${page.slug}` : '/'}
                  page={page}
                />
              }
            />
          ))}
        </Box>
      </TreeItem>
    )
  }

  const page = node.pages.length === 1 ? node.pages[0] : undefined
  const isLeafPage = page && children.length === 0

  const handleSelect = () => {
    if (isLeafPage) {
      handlePageSelect(page)
    } else {
      handleFolderSelect()
    }
  }

  const title =
    node.part === '__self__' && page ? page.title : page?.title || formatEmptyFolderTitle(node.part)
  const subtitle = page ? (page.slug ? `/${page.slug}` : '/') : node.id.replace('root', '')

  return (
    <TreeItem
      icon={page ? DocumentIcon : expanded ? PiFolderOpen : PiFolder}
      expanded={expanded}
      onClick={handleSelect}
      selected={isSelected && page !== undefined}
      text={<TreeItemLabel title={title} subtitle={subtitle} page={page} />}
    >
      {children.length > 0 && (
        <Box paddingLeft={4}>
          {children.map((child) => (
            <TreeItemComponent key={child.id} node={child} selectedId={selectedId} />
          ))}
        </Box>
      )}
    </TreeItem>
  )
}
