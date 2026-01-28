---
inject: true
to: web/src/data/sanity/fragments/sections/index.ts
after: INJECT_TYPE
---
export * as <%= h.inflection.camelize( name, true ) %> from './<%= h.inflection.camelize( name, true ) %>'