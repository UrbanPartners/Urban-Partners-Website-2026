import { I18N_TEXT } from '@/data/i18n'
import useCurrentPage from '@/hooks/use-current-page'
import { replaceTextStringWithVars } from '@/utils'
import { useCallback } from 'react'

const IGNORE_BASE_PATHS = ['favicon', '.well-known', '_next']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const geti18nText = (language: string, key: string, variables?: any) => {
  if (!key) {
    return
  }

  const textToUse = I18N_TEXT[language as keyof typeof I18N_TEXT]

  if (!textToUse) {
    if (process.env.NODE_ENV === 'development') {
      if (IGNORE_BASE_PATHS.includes(language)) {
        return
      }

      console.error(`Text key ${language} does not exist in I18N_TEXT.`)
    }

    return
  }

  let textString = textToUse[key as keyof typeof textToUse]

  if (!textString) return `[MISSING TEXT KEY ${key}]`

  if (variables) {
    textString = replaceTextStringWithVars(textString, variables)
  }

  return textString
}

const useI18n = () => {
  const { currentLanguage } = useCurrentPage()

  const i18n = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (key: string, variables?: any) => {
      return geti18nText(currentLanguage as string, key, variables)
    },
    [currentLanguage],
  )

  return { i18n }
}

useI18n.displayName = 'useI18n'

export default useI18n
