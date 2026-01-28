'use client'

import React from 'react'

type GlobalSettingsContextType = {
  globalSettingsData: SanitySiteSettingsResponse | null
  isPreviewMode: boolean
  hasSanityPreviewToken: boolean
}

export const GlobalSettingsContext = React.createContext({
  globalSettingsData: null,
  isPreviewMode: false,
  hasSanityPreviewToken: false,
} as GlobalSettingsContextType)

GlobalSettingsContext.displayName = 'GlobalSettingsContext'

export const GlobalSettingsProvider = ({
  children,
  globalSettingsData,
  isPreviewMode,
  hasSanityPreviewToken,
}: {
  children: React.ReactNode
  globalSettingsData: SanitySiteSettingsResponse | null
  isPreviewMode: boolean
  hasSanityPreviewToken: boolean
}) => {
  return (
    <GlobalSettingsContext.Provider
      value={{
        globalSettingsData,
        isPreviewMode,
        hasSanityPreviewToken,
      }}
    >
      {children}
    </GlobalSettingsContext.Provider>
  )
}

GlobalSettingsProvider.displayName = 'GlobalSettingsProvider'
