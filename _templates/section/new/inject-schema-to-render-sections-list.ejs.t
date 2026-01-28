---
inject: true
to: web/src/data/sanity/fragments/renderSections.ts
after: INJECT_TYPE
---
  '<%= h.inflection.camelize( name, true ) %>',