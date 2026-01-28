'use client'

import React, { useState, createContext, useContext } from 'react'

type OurStoryScrollerContextType = {
  caseStudyScaleoutDistance: number
  setCaseStudyScaleoutDistance: (distance: number) => void
  locationsOutroDistance: number
  setLocationsOutroDistance: (distance: number) => void
}

export const OurStoryScrollerContext = createContext<OurStoryScrollerContextType>({
  caseStudyScaleoutDistance: 0,
  setCaseStudyScaleoutDistance: () => {},
  locationsOutroDistance: 0,
  setLocationsOutroDistance: () => {},
})

OurStoryScrollerContext.displayName = 'OurStoryScrollerContext'

export const OurStoryScrollerProvider = ({ children }: { children: React.ReactNode }) => {
  const [caseStudyScaleoutDistance, setCaseStudyScaleoutDistance] = useState<number>(0)
  const [locationsOutroDistance, setLocationsOutroDistance] = useState<number>(0)
  return (
    <OurStoryScrollerContext.Provider
      value={{
        caseStudyScaleoutDistance,
        setCaseStudyScaleoutDistance,
        locationsOutroDistance,
        setLocationsOutroDistance,
      }}
    >
      {children}
    </OurStoryScrollerContext.Provider>
  )
}

OurStoryScrollerProvider.displayName = 'OurStoryScrollerProvider'

export const useOurStoryScrollerContext = () => {
  const context = useContext(OurStoryScrollerContext)
  if (!context) {
    throw new Error('useOurStoryScrollerContext must be used within OurStoryScrollerProvider')
  }
  return context
}
