import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import gsap from 'gsap'

interface SvgProps {
  className?: string
}

export interface LogoAnimatedRef {
  animateIn: () => void
}

const DURATION = 0.2
const EASE = 'Power3.easeOut'

const LogoAnimated = forwardRef<LogoAnimatedRef, SvgProps>(({ className }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const timelineRef = useRef<GSAPTimeline | null>(null)
  const playthroughTimelineRef = useRef<GSAPTimeline | null>(null)

  const getPaths = () => {
    return svgRef.current?.querySelectorAll('path')
  }

  const createTimeline = () => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    timelineRef.current = gsap.timeline({ paused: true })

    const paths = getPaths()

    if (!paths) return

    // Reset to initial state
    gsap.set(paths, {
      transformOrigin: '0 0',
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
      // opacity: 1,
    })

    // Part 1: Animate Out

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toVars: any = {}

    paths.forEach((path, index) => {
      const bbox = path.getBBox()
      const ratio = bbox.width / bbox.height
      const isWide = ratio > 1

      const vars: gsap.TweenVars = {
        duration: DURATION,
        ease: 'none',
      }

      if (isWide) {
        vars.scaleX = 0
      } else {
        vars.scaleY = 0
      }

      toVars[index] = vars

      if (timelineRef.current) {
        timelineRef.current.fromTo(
          path,
          {
            scaleX: 1,
            scaleY: 1,
          },
          vars,
          0,
        )
      }
    })

    paths.forEach((path, index) => {
      const bbox = path.getBBox()
      const ratio = bbox.width / bbox.height
      const isWide = ratio > 1
      const delay = index * 0.01
      const initialToVars = toVars[index]

      // Set position to opposite side
      const setDuration = 0.000001
      const setVars: gsap.TweenVars = {
        duration: setDuration,
      }
      if (isWide) {
        setVars.x = bbox.width
      } else {
        setVars.y = bbox.height
      }

      if (timelineRef.current) {
        timelineRef.current.set(path, setVars, DURATION)

        // Animate in to 0,0
        const toVars: gsap.TweenVars = {
          scaleX: 1,
          scaleY: 1,
          x: 0,
          y: 0,
          duration: DURATION,
          ease: EASE,
        }

        timelineRef.current.fromTo(path, initialToVars, toVars, DURATION + 0.00001 + delay)
      }
    })
  }

  useEffect(() => {
    createTimeline()
    if (timelineRef.current) {
      if (playthroughTimelineRef.current) {
        playthroughTimelineRef.current.kill()
      }
      playthroughTimelineRef.current = gsap.timeline({ paused: true })
      if (!timelineRef.current) return
      const totalDuration = timelineRef.current.totalDuration()

      const stages = {
        1: () => {
          timelineRef.current?.restart()
          timelineRef.current?.play()
        },
        2: () => {},
      }

      playthroughTimelineRef.current.add(stages[1], 0)
      playthroughTimelineRef.current.add(stages[2], totalDuration)

      playthroughTimelineRef.current.play()
    }
    // eslint-disable-next-line
  }, [])

  useImperativeHandle(ref, () => ({
    animateIn: () => {
      if (playthroughTimelineRef.current) {
        playthroughTimelineRef.current.restart()
        playthroughTimelineRef.current.play()
      }
    },
  }))

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 32 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6632 3.08008H8.53125V9.50472H10.6632V3.08008Z"
        fill="currentColor"
      />
      <path
        d="M17.0704 0.9375H14.9375V15.93H17.0704V0.9375Z"
        fill="currentColor"
      />
      <path
        d="M23.4689 13.7881H21.3359V22.356H23.4689V13.7871V13.7881Z"
        fill="currentColor"
      />
      <path
        d="M29.8629 22.3555H19.1953V24.4967H29.8629V22.3555Z"
        fill="currentColor"
      />
      <path
        d="M21.3305 15.9297H12.7969V18.0709H21.3315L21.3305 15.9297Z"
        fill="currentColor"
      />
      <path
        d="M14.9245 9.50391H2.125V11.6451H14.9245V9.50391Z"
        fill="currentColor"
      />
      <path
        d="M10.6632 13.7881H8.53125V22.356H10.6632V13.7871V13.7881Z"
        fill="currentColor"
      />
      <path
        d="M17.0704 20.2129H14.9375V33.0622H17.0704V20.2129Z"
        fill="currentColor"
      />
      <path
        d="M14.9245 22.3555H2.125V24.4967H14.9245V22.3555Z"
        fill="currentColor"
      />
      <path
        d="M8.53467 15.9297H0V18.0709H8.53467V15.9297Z"
        fill="currentColor"
      />
      <path
        d="M10.6632 26.6387H8.53125V30.9231H10.6632V26.6387Z"
        fill="currentColor"
      />
      <path
        d="M23.4689 26.6384H21.3359V30.9229H23.4689V26.6384ZM23.4689 3.08008H21.3359V9.50472H23.4689V3.08008Z"
        fill="currentColor"
      />
      <path
        d="M29.8629 9.50391H19.1953V11.6451H29.8629V9.50391Z"
        fill="currentColor"
      />
      <path
        d="M32.0013 15.9297H25.6016V18.0709H32.0013V15.9297Z"
        fill="currentColor"
      />
    </svg>
  )
})

export default LogoAnimated

LogoAnimated.displayName = 'LogoAnimated'
