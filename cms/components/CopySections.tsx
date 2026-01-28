// ./src/inputs/CopyFromLocaleArrayInput.tsx
import React, {useCallback} from 'react'
import {Button, Stack, Grid} from '@sanity/ui'
import {
  PatchEvent,
  set,
  setIfMissing,
  insert,
  type ArrayOfObjectsInputProps,
  useFormValue,
} from 'sanity'

function newKey() {
  // Sanity _key is typically short-ish; uniqueness matters.
  // crypto.randomUUID() is fine in modern browsers.
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

type Options = {
  sourcePath: (string | number)[]
  targetPath: (string | number)[]
  mode?: 'replace' | 'append'
}

export function CopyFromLocaleArrayInput(
  props: ArrayOfObjectsInputProps & {schemaType: {options?: Options}},
) {
  const {renderDefault, onChange, schemaType} = props
  const options = schemaType.options || {
    sourcePath: ['enSections'],
    targetPath: ['xyz'],
  }

  const source = useFormValue(options.sourcePath) as unknown[] | undefined
  const target = useFormValue(options.targetPath) as unknown[] | undefined

  const handleCopy = useCallback(
    (mode: 'replace' | 'append') => {
      if (!Array.isArray(source) || source.length === 0) return

      // Clone and re-key items so DK array can safely coexist / append without key collisions
      const cloned = deepClone(source).map((item: any) => ({
        ...item,
        _key: newKey(),
      }))

      if (mode === 'append') {
        onChange(
          PatchEvent.from([
            setIfMissing([]),
            // append at end
            insert(cloned, 'after', [-1]),
          ]),
        )
      } else {
        // replace entire DK array
        onChange(PatchEvent.from([setIfMissing([]), set(cloned)]))
      }
    },
    [onChange, source],
  )

  const disabled = !Array.isArray(source) || source.length === 0

  return (
    <Stack space={3}>
      <Grid columns={2} gap={2}>
        <Button
          text="Append from EN"
          tone="primary"
          mode="ghost"
          disabled={disabled}
          onClick={() => handleCopy('append')}
        />
        <Button
          text="Replace with EN"
          tone="caution"
          disabled={disabled}
          onClick={() => handleCopy('replace')}
        />
      </Grid>
      {Array.isArray(target) && target.length > 0 ? (
        <div style={{fontSize: 12, opacity: 0.8}}>
          &quot;Replace&quot; will overwrite the current sections.
        </div>
      ) : null}
      {renderDefault(props)}
    </Stack>
  )
}
