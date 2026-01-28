import { Page, TreeNode } from './PagesTreeView.types';

export const buildTree = (pages: Page[]): TreeNode => {
  const root: TreeNode = {
    id: 'root',
    part: 'root',
    children: new Map(),
    pages: [],
  };

  // Sort pages to ensure home page (no slug) comes first, then alphabetically
  const sortedPages = [...pages].sort((a, b) => {
    if (!a.slug) return -1;
    if (!b.slug) return 1;
    return a.slug.localeCompare(b.slug);
  });

  for (const page of sortedPages) {
    const parts = page.slug ? page.slug.split('/').filter(Boolean) : [];
    if (parts.length === 0) {
      // This is the homepage
      const homeNode: TreeNode = {
        id: `${root.id}/home`,
        part: 'home',
        pages: [page],
        children: new Map(),
      };
      root.children.set('home', homeNode);
      continue;
    }

    let node = root;
    for (const part of parts) {
      // If the current node is a page, we need to convert it into a folder
      // by moving its page data to a special '__self__' child.
      if (node.pages.length > 0) {
        node.children.set('__self__', {
          id: `${node.id}/__self__`,
          part: '__self__',
          pages: node.pages,
          children: new Map(),
        });
        node.pages = [];
      }

      if (!node.children.has(part)) {
        node.children.set(part, {
          id: `${node.id}/${part}`,
          part,
          children: new Map(),
          pages: [],
        });
      }
      node = node.children.get(part)!;
    }

    // If the target node already has children, this page is an "index" page.
    // We should place it in a special '__self__' child.
    if (node.children.size > 0) {
      if (node.children.has('__self__')) {
        const selfNode = node.children.get('__self__')!;
        selfNode.pages.push(page);
      } else {
        node.children.set('__self__', {
          id: `${node.id}/__self__`,
          part: '__self__',
          pages: [page],
          children: new Map(),
        });
      }
    } else {
      node.pages.push(page);
    }
  }

  return root;
};

export const formatEmptyFolderTitle = (title: string): string => {
  return title
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
