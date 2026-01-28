---
to: web/src/sections/<%= h.inflection.camelize( name, false ) %>/<%= h.inflection.camelize( name, false ) %>.tsx
---
'use client'

import classnames from 'classnames'
import styles from './<%= h.inflection.camelize( name, false ) %>.module.scss'

const <%= h.inflection.camelize( name, false ) %> = ({ className }: Sanity<%= h.inflection.camelize( name, false ) %>) => {
  return (
    <div className={classnames(styles.<%= h.inflection.camelize( name, false ) %>, className)}>
      <div className={styles.inner}>
        <%= h.inflection.camelize( name, false ) %> component
      </div>
    </div>
  )
}

<%= h.inflection.camelize( name, false ) %>.displayName = '<%= h.inflection.camelize( name, false ) %>'

export default <%= h.inflection.camelize( name, false ) %>
