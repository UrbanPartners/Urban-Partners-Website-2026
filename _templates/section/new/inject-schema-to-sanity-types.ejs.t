---
inject: true
to: cms/schemaTypes/index.ts
after: INJECT_OBJECT_TYPE
---
  <%= h.inflection.camelize( name, true ) %>,