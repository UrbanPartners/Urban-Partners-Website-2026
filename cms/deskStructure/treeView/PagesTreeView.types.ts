export type Page = {
  _id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft' | 'changed';
  publishedAt?: string;
  draftUpdatedAt?: string;
};

export type TreeNode = {
  id: string;
  part: string;
  pages: Page[];
  children: Map<string, TreeNode>;
};
