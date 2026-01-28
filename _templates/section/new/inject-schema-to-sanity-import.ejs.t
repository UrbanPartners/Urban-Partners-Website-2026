---
inject: true
to: cms/schemaTypes/index.ts
after: INJECT_OBJECT_DEFINITION
---
import <%= h.inflection.camelize( name, true ) %> from './sections/<%= h.inflection.camelize( name, true ) %>'