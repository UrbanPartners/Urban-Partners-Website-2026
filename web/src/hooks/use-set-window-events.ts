import { useEffect } from 'react'
import useStore from '@/store'

export default function useSetWindowEvents() {
  const setMouseCoordinates = useStore(state => state.setMouseCoordinates)

  useEffect(() => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const handleMouseOver = (e: any) => {
      let x = 0
      let y = 0

      if (e.changedTouches) {
        x = e.changedTouches[0]?.clientX
        y = e.changedTouches[0]?.clientY
      } else {
        x = e.clientX
        y = e.clientY
      }

      setMouseCoordinates({ x, y })
    }

    document.removeEventListener('pointerdown', handleMouseOver)
    document.removeEventListener('pointermove', handleMouseOver)
    document.removeEventListener('mousemove', handleMouseOver)
    document.addEventListener('mousemove', handleMouseOver)
    document.addEventListener('pointerdown', handleMouseOver)
    document.addEventListener('pointermove', handleMouseOver)

    return () => {
      document.removeEventListener('pointerdown', handleMouseOver)
      document.removeEventListener('pointermove', handleMouseOver)
      document.removeEventListener('mousemove', handleMouseOver)
    }
  }, [setMouseCoordinates])

  return null
}
