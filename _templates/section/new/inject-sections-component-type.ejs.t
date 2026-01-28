---
inject: true
to: web/src/components/Sections/Sections.tsx
after: INJECT_SECTIONS_COMPONENT_TYPE
---
  <%= h.inflection.camelize( name, true ) %>: <%= h.inflection.camelize( name, false ) %>,