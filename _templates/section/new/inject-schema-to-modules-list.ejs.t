---
inject: true
to: web/src/data/sanity/fragments/sections.ts
after: INJECT_TYPE
---
  '<%= h.inflection.camelize( name, true ) %>',