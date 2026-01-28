'use client'

import React, { useState } from 'react'

/* eslint-disable */
type WipeContextType = {
  $wipe: any
  setWipeContext: any
}
/* eslint-enable */

export const WipeContext = React.createContext({
  $wipe: null,
  setWipeContext: null,
} as WipeContextType)

WipeContext.displayName = 'WipeContext'

export const WipeProvider = ({ children }: { children: React.ReactNode }) => {
  const [$wipe, setWipeContext] = useState<{ animateIn: () => void; animateOut: () => void } | null>(null)

  return (
    <WipeContext.Provider
      value={{
        $wipe,
        setWipeContext,
      }}
    >
      {children}
    </WipeContext.Provider>
  )
}

WipeProvider.displayName = 'WipeProvider'
