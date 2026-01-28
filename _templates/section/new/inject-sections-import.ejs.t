---
inject: true
to: web/src/components/Sections/Sections.tsx
after: INJECT_SECTIONS_IMPORT
---
import <%= h.inflection.camelize( name, false ) %> from '@/sections/<%= h.inflection.camelize( name, false ) %>/<%= h.inflection.camelize( name, false ) %>'