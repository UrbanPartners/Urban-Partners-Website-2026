import React, {useCallback} from 'react'
import {ArrayOfPrimitivesInputProps, set, unset} from 'sanity'
import {Box, Card, Checkbox, Grid, Stack, Text} from '@sanity/ui'

interface LanguageOption {
  title: string
  value: string
}

type LanguageGridSelectProps = ArrayOfPrimitivesInputProps & {
  schemaType: ArrayOfPrimitivesInputProps['schemaType'] & {
    options?: {
      list?: LanguageOption[]
    }
  }
}

const LanguageGridSelect = (props: LanguageGridSelectProps) => {
  const {value = [], onChange, schemaType} = props
  const languages = schemaType?.options?.list || []

  const handleToggle = useCallback(
    (languageValue: string) => {
      const currentValues = (value || []) as string[]
      const isSelected = currentValues.includes(languageValue)

      if (isSelected) {
        // Remove the language
        const newValue = currentValues.filter((v) => v !== languageValue)
        onChange(newValue.length > 0 ? set(newValue) : unset())
      } else {
        // Add the language
        const newValue = [...currentValues, languageValue]
        onChange(set(newValue))
      }
    },
    [value, onChange],
  )

  return (
    <Stack space={3}>
      <Grid columns={[2, 2, 3, 4]} gap={2}>
        {languages.map((language) => {
          const currentValues = (value || []) as string[]
          const isSelected = currentValues.includes(language.value)

          return (
            <Card
              key={language.value}
              padding={3}
              radius={2}
              shadow={1}
              tone={isSelected ? 'primary' : 'default'}
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: isSelected ? '2px solid #2276fc' : '2px solid transparent',
              }}
              onClick={() => handleToggle(language.value)}
            >
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Checkbox checked={isSelected} readOnly style={{pointerEvents: 'none'}} />
                <Text size={1} weight={isSelected ? 'semibold' : 'medium'}>
                  {language.title}
                </Text>
              </Box>
            </Card>
          )
        })}
      </Grid>
    </Stack>
  )
}

export default LanguageGridSelect
