import buildNestedPages from './buildNestedPages'

export const structure = {
  structure: (S: any) =>
    S.list()
      .title('Content')
      .items(
        [
          // Pages
          buildNestedPages(S),
          S.listItem()
            .title('Blog Posts')
            .icon(() => '📝')
            .child(S.documentTypeList('blogPost').title('Blog Posts')),
          S.listItem()
            .title('Case Studies')
            .icon(() => '🏢')
            .child(S.documentTypeList('caseStudy').title('Case Studies')),
          // Other Types
          S.divider(),
          S.listItem()
            .title('Blog Categories')
            .icon(() => '📚')
            .child(S.documentTypeList('blogCategory').title('Blog Categories')),
          S.listItem()
            .title('Blog References')
            .icon(() => '📚')
            .child(S.documentTypeList('blogReference').title('Blog References')),
          S.listItem()
            .title('People')
            .icon(() => '👤')
            .child(S.documentTypeList('person').title('People')),
          S.listItem()
            .title('Shared Sections')
            .icon(() => '🔄')
            .child(S.documentTypeList('sharedSection').title('Shared Sections')),

          // Settings
          S.divider(),
          S.listItem()
            .title('Settings')
            .icon(() => '⚙️')
            .child(
              S.document()
                .schemaType('globalSettings')
                .documentId('globalSettings')
                .title('Global Settings'),
            ),
        ].filter(Boolean),
      ),
}

export default structure
