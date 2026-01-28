import classnames from 'classnames'
import styles from './Wipe.module.scss'
import useStore from '@/store'
import { useContext, useEffect, useRef } from 'react'
import { TRANSITION_DURATION } from '@/data'
import gsap from 'gsap'
import { WipeContext } from '@/context/WipeContext'

type WipeProps = {
  className?: string
}

const Wipe = ({ className }: WipeProps) => {
  const setPageIsTransitioning = useStore(state => state.setPageIsTransitioning)
  const bgRef = useRef<HTMLDivElement | null>(null)
  const allowPageTransitionsRef = useRef(false)
  const { setWipeContext } = useContext(WipeContext)

  const resetAnimation = () => {
    gsap.set(bgRef.current, {
      '--left-y': '100%',
      '--right-y': '100%',
      y: 0,
    })
  }

  const animateIn = async (callback: () => void) => {
    if (!bgRef.current) return

    gsap.killTweensOf(bgRef.current)

    setPageIsTransitioning(true)

    await gsap.to(bgRef.current, {
      '--left-y': '0%',
      '--right-y': '0%',
      duration: TRANSITION_DURATION,
      ease: 'Power3.easeInOut',
      onComplete: () => {
        if (callback) callback()
      },
    })
  }

  const animateOut = async (callback: () => void) => {
    if (!bgRef.current) return

    gsap.killTweensOf(bgRef.current)

    setTimeout(() => {
      setPageIsTransitioning(false)
    }, TRANSITION_DURATION * 0.5 * 1000)

    await gsap.to(bgRef.current, {
      y: '-100%',
      duration: TRANSITION_DURATION,
      ease: 'Power3.easeInOut',
      onComplete: () => {
        resetAnimation()
        if (callback) callback()
      },
    })
  }

  useEffect(() => {
    setTimeout(() => {
      resetAnimation()
      allowPageTransitionsRef.current = true
    }, 500)
  }, [])

  useEffect(() => {
    setWipeContext({
      animateIn,
      animateOut,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={classnames(styles.Wipe, className)}>
      <div
        className={styles.wipeBg}
        ref={bgRef}
      />
    </div>
  )
}

Wipe.displayName = 'Wipe'

export default Wipe
