---
inject: true
to: cms/schemaTypes/documents/sharedSection.tsx
after: INJECT_TYPE
---
  '<%= h.inflection.camelize( name, true ) %>',