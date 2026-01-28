---
inject: true
to: web/src/types/components/SectionsProps.d.ts
after: INJECT_SECTIONS_TYPE
---
    Sanity<%= h.inflection.camelize( name, false ) %> |