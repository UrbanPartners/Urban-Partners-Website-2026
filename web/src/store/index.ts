import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { Coordinate } from '@/types/GeneralTypes'

const STORAGE_KEY = 'UP_STORAGE'

export type NavState = 'STATIC' | 'HIDDEN' | 'HIDDEN_IMMEDIATELY' | 'VISIBLE_ON_SCROLL'

type StoreValues = {
  // Global Settings
  canInteract: boolean
  lastElementInFocus: HTMLElement | null
  pageIsTransitioning: boolean
  fontsLoaded: boolean
  allowIsInView: boolean
  preloaderIsAnimatingOut: boolean
  pageHistory: string[]
  cmsDebug: boolean

  // Navigation
  navIsOpen: boolean
  navState: NavState

  // Sections
  firstSectionType: string | null

  // Interaction
  scrollY: number
  mouseCoordinates: Coordinate
}

type StoreSetters = {
  // Global Settings
  setCanInteract: (value: StoreValues['canInteract']) => void
  setLastElementInFocus: (value: StoreValues['lastElementInFocus']) => void
  setPageIsTransitioning: (value: StoreValues['pageIsTransitioning']) => void
  setFontsLoaded: (value: StoreValues['fontsLoaded']) => void
  setAllowIsInView: (value: StoreValues['allowIsInView']) => void
  setPreloaderIsAnimatingOut: (value: StoreValues['preloaderIsAnimatingOut']) => void
  updatePageHistory: (value: string) => void
  setCmsDebug: (value: StoreValues['cmsDebug']) => void

  // Navigtion
  setNavIsOpen: (value: StoreValues['navIsOpen']) => void
  setNavState: (value: StoreValues['navState']) => void

  // Sections
  setFirstSectionType: (value: StoreValues['firstSectionType']) => void

  // Interaction
  setScrollY: (value: number) => void
  setMouseCoordinates: (value: Coordinate) => void
}

type CombinedStoreValuesAndSetters = StoreValues & StoreSetters

export const useStore = create(
  subscribeWithSelector(
    persist<CombinedStoreValuesAndSetters>(
      set => ({
        // Global Settings
        canInteract: true,
        setCanInteract: canInteract => set({ canInteract }),
        fontsLoaded: false,
        setFontsLoaded: fontsLoaded => set({ fontsLoaded }),
        lastElementInFocus: null,
        setLastElementInFocus: lastElementInFocus => set({ lastElementInFocus }),
        pageIsTransitioning: false,
        setPageIsTransitioning: pageIsTransitioning => set({ pageIsTransitioning }),
        allowIsInView: false,
        setAllowIsInView: allowIsInView => set({ allowIsInView }),
        preloaderIsAnimatingOut: false,
        setPreloaderIsAnimatingOut: preloaderIsAnimatingOut => set({ preloaderIsAnimatingOut }),
        pageHistory: [],
        updatePageHistory: newPage => {
          const pageHistory = useStore.getState().pageHistory
          if (!newPage) return
          return set({
            pageHistory: [...pageHistory, newPage],
          })
        },
        cmsDebug: false,
        setCmsDebug: cmsDebug => set({ cmsDebug }),

        // Navigation
        navIsOpen: false,
        setNavIsOpen: navIsOpen => set({ navIsOpen }),
        navState: 'STATIC',
        setNavState: navState => set({ navState }),

        // Sections
        firstSectionType: null,
        setFirstSectionType: firstSectionType => set({ firstSectionType }),

        // Interaction
        scrollY: 0,
        setScrollY: (scrollY: number) => set({ scrollY }),
        mouseCoordinates: { x: 0, y: 0 },
        setMouseCoordinates: mouseCoordinates => set({ mouseCoordinates }),
      }),
      {
        name: STORAGE_KEY, // name of the item in the storage (must be unique)
        partialize: state => ({ mouseCoordinates: state.mouseCoordinates }) as CombinedStoreValuesAndSetters,
      },
    ),
  ),
)

export default useStore
