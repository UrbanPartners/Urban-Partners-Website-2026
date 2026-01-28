import { DocumentsIcon } from '@sanity/icons';
import type { ListItemBuilder, StructureBuilder } from 'sanity/structure';

import { PagesTreeView } from './treeView/PagesTreeView';

const buildNestedPages = (S: StructureBuilder): ListItemBuilder => {
  return S.listItem()
    .title('Pages')
    .id('pages')
    .icon(DocumentsIcon)
    .schemaType('page')
    .child(S.component(PagesTreeView as any).title('Pages'));
};

export default buildNestedPages;
