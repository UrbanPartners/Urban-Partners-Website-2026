'use client'

import Link from '@/components/Link/Link'
import styles from './NavigationInner.module.scss'
import { useContext, useRef, useEffect, useState, forwardRef, useMemo } from 'react'
import { GlobalSettingsContext } from '@/context/GlobalSettings'
import classNames from 'classnames'
import useCurrentPage from '@/hooks/use-current-page'
import ArrowButton, { ArrowButtonRef } from '@/components/ArrowButton/ArrowButton'
import useStore, { NavState } from '@/store'
import gsap from 'gsap'
import ColorBar, { ColorBarRef } from '@/components/ColorBar/ColorBar'
import Menu, { MenuRef } from '@/components/Menu/Menu'
import LineAnimation, { LineAnimationRef } from '@/components/LineAnimation/LineAnimation'
import MaskReveal, { MaskRevealRef } from '@/components/MaskReveal/MaskReveal'
import { DURATION as MENU_DURATION, LONG_LINE_DURATION as MENU_LONG_LINE_DURATION } from '@/components/Menu/Menu'
import { ScrollContext } from '@/context/Scroll'
import LogoAnimated, { LogoAnimatedRef } from '@/components/LogoAnimated/LogoAnimated'
import useBreakpoint from '@/hooks/use-breakpoint'
import TextSwapper, { TextSwapperRef } from '@/components/TextSwapper/TextSwapper'
import LanguageSelect from '@/components/LanguageSelect/LanguageSelect'

export const NAV_ID = 'nav'

type NavigationProps = {
  className?: string
}

const SCROLL_THRESHOLD = 150

const FADE_IN_CONFIG = {
  duration: 0.3,
  opacity: 1,
  delay: 0.3,
}

const NavigationInner = ({ className }: NavigationProps) => {
  const { globalSettingsData } = useContext(GlobalSettingsContext)
  const navigationData = globalSettingsData?.navigation
  const pageIsTransitioning = useStore(state => state.pageIsTransitioning)
  const { onScrollCallback } = useContext(ScrollContext)
  const prevScroll = useRef(0)
  const beganScrollingBackAtRef = useRef<number | null>(null)
  const navState = useStore(state => state.navState)
  const setNavState = useStore(state => state.setNavState)
  const prevNavStateRef = useRef<NavState>('STATIC')
  const navIsOpen = useStore(state => state.navIsOpen)
  const navIsOpenRef = useRef(navIsOpen)
  const firstSectionType = useStore(store => store.firstSectionType)
  const navRef = useRef<HTMLDivElement>(null)
  const prevThemeRef = useRef<'dark' | 'light'>(undefined)
  const [pageIsTransitioningDebounced, setPageIsTransitioningDebounced] = useState(pageIsTransitioning)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const theme = useMemo(() => {
    if (pageIsTransitioningDebounced) {
      return prevThemeRef.current
    }
    if (firstSectionType === 'homeHero' && navState === 'STATIC') {
      return 'dark'
    }
    return 'light'
  }, [firstSectionType, navState, pageIsTransitioningDebounced])

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    if (pageIsTransitioning) {
      setPageIsTransitioningDebounced(true)
    } else {
      const needsMoreTime = firstSectionType === 'homeHero'
      debounceTimeoutRef.current = setTimeout(
        () => {
          setPageIsTransitioningDebounced(pageIsTransitioning)
        },
        needsMoreTime ? 500 : 0,
      )
    }
  }, [pageIsTransitioning, firstSectionType])

  useEffect(() => {
    prevThemeRef.current = theme
  }, [theme])

  useEffect(() => {
    gsap.to(navRef.current, FADE_IN_CONFIG)
  }, [])

  useEffect(() => {
    navIsOpenRef.current = navIsOpen
    if (navIsOpen) {
      if (prevScroll.current === 0) {
        setNavState('STATIC')
      } else {
        setNavState('VISIBLE_ON_SCROLL')
      }
    }
  }, [navIsOpen, setNavState])

  useEffect(() => {
    const scrollKey = 'navOnScroll'
    onScrollCallback({ key: scrollKey, remove: true })
    onScrollCallback({
      key: scrollKey,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (scroll: any) => {
        if (navIsOpenRef.current) return
        const scrollY = scroll.animatedScroll

        if (scrollY < 0) return

        let state: NavState | null = null

        if (scrollY > SCROLL_THRESHOLD) {
          if (scrollY > prevScroll.current) {
            beganScrollingBackAtRef.current = scrollY
            if (prevNavStateRef.current === 'STATIC') {
              state = 'HIDDEN_IMMEDIATELY'
            } else {
              if (prevNavStateRef.current !== 'HIDDEN_IMMEDIATELY') {
                state = 'HIDDEN'
              }
            }
          } else if (scrollY < prevScroll.current) {
            state = 'VISIBLE_ON_SCROLL'
          }
        } else {
          if (prevNavStateRef.current !== 'VISIBLE_ON_SCROLL') {
            state = 'STATIC'
          }

          if (scrollY === 0) {
            state = 'STATIC'
          }
        }

        if (state && state !== prevNavStateRef.current) {
          prevNavStateRef.current = state
          setNavState(state)
        }

        prevScroll.current = scrollY
      },
    })

    return () => {
      onScrollCallback({ key: scrollKey, remove: true })
    }
  }, [onScrollCallback, setNavState])

  if (!navigationData?.headerLinksLeftSide?.length || !navigationData?.headerLinksRightSide?.length) return null

  return (
    <>
      <header
        id={NAV_ID}
        className={classNames(styles.Navigation, className)}
        data-nav-theme={theme}
        data-nav-state={navState}
        ref={navRef}
      >
        <nav className={styles.nav}>
          <ul className={classNames(styles.desktopLinkList, styles.leftSide)}>
            <NavigationListItem hasColorBar={false}>
              <HomeLinkLogo />
            </NavigationListItem>

            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {navigationData.headerLinksLeftSide.map((item: any, i: number) => {
              return (
                <NavigationListItem
                  key={i}
                  className={styles.desktopLinkList__desktopLink}
                >
                  <DesktopLink
                    link={item.link}
                    hasArrow={item.hasArrow}
                    className={styles.desktopLink}
                  />
                </NavigationListItem>
              )
            })}
          </ul>
          <ul className={classNames(styles.desktopLinkList, styles.rightSide)}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {navigationData.headerLinksRightSide.map((item: any, i: number) => {
              return (
                <NavigationListItem
                  key={i}
                  className={classNames(styles.desktopLinkList__desktopLink, styles.rightSideDesktopLink)}
                >
                  <DesktopLink
                    link={item.link}
                    hasArrow={item.hasArrow}
                    className={styles.desktopLink}
                  />
                </NavigationListItem>
              )
            })}
            <NavigationListItem className={classNames(styles.desktopLinkList__desktopLink)}>
              <LanguageSelect theme={theme === 'light' ? 'dark' : 'light'} />
            </NavigationListItem>
            <NavigationListItem hasColorBar={false}>
              <HamburgerButton isPlaceholder={true} />
            </NavigationListItem>
          </ul>
        </nav>
      </header>
      <HamburgerButton
        theme={theme}
        navState={navState}
      />
      <MenuBgOverlay />
      <MenuLayer />
    </>
  )
}

const HomeLinkLogo = forwardRef<HTMLAnchorElement, { className?: string }>(({ className }, ref) => {
  const { homeLink } = useCurrentPage()
  const logoAnimatedRef = useRef<LogoAnimatedRef | null>(null)
  const { isMobile } = useBreakpoint()

  return (
    <Link
      ref={ref}
      link={homeLink}
      className={classNames(styles.logoWrapper, className)}
      onClick={() => {
        if (isMobile) {
          if (logoAnimatedRef.current) {
            logoAnimatedRef.current.animateIn()
          }
        }
      }}
      onMouseEnter={() => {
        if (isMobile) return
        if (logoAnimatedRef.current) {
          logoAnimatedRef.current.animateIn()
        }
      }}
    >
      <LogoAnimated
        className={styles.logo}
        ref={logoAnimatedRef}
      />
    </Link>
  )
})

type NavigationListItemProps = {
  children: React.ReactNode
  className?: string
  hasColorBar?: boolean
}

const NavigationListItem = ({ children, className, hasColorBar = true }: NavigationListItemProps) => {
  const colorBarRef = useRef<ColorBarRef>(null)

  const handleMouseEnter = () => {
    if (colorBarRef.current) {
      colorBarRef.current.animateIn()
    }
  }

  const handleMouseLeave = () => {
    if (colorBarRef.current) {
      colorBarRef.current.animateOut()
    }
  }

  return (
    <li
      className={classNames(styles.desktopLinkList__li, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hasColorBar && (
        <ColorBar
          ref={colorBarRef}
          transformOrigin="bottom"
          className={styles.desktopLinkList__colorBar}
        />
      )}
      <span className={styles.desktopLinkList__content}>{children}</span>
    </li>
  )
}

const HamburgerButton = ({
  className,
  isPlaceholder = false,
  theme = 'dark',
  navState,
}: {
  className?: string
  isPlaceholder?: boolean
  theme?: 'light' | 'dark'
  navState?: NavState
}) => {
  const setNavIsOpen = useStore(state => state.setNavIsOpen)
  const navIsOpen = useStore(state => state.navIsOpen)
  const [isHover, setIsHover] = useState(false)

  // Refs for hamburger lines
  const openLine1Ref = useRef<HTMLDivElement>(null)
  const openLine2Ref = useRef<HTMLDivElement>(null)
  const openLine3Ref = useRef<HTMLDivElement>(null)
  const closeLine1Ref = useRef<HTMLDivElement>(null)
  const closeLine2Ref = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const colorBarRef = useRef<ColorBarRef>(null)

  // GSAP timeline ref
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    gsap.to(buttonRef.current, FADE_IN_CONFIG)
  }, [])

  useEffect(() => {
    if (isPlaceholder) return
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    if (
      !openLine1Ref.current ||
      !openLine2Ref.current ||
      !openLine3Ref.current ||
      !closeLine1Ref.current ||
      !closeLine2Ref.current
    ) {
      console.warn('Hamburger button lines not found')
      return
    }

    // Create GSAP timeline
    timelineRef.current = gsap.timeline({ paused: true })

    // Animation sequence
    timelineRef.current
      // First: translateY open lines 1 and 3 to 0
      .to([openLine1Ref.current, openLine3Ref.current], {
        y: 0,
        duration: 0.1,
        ease: 'power2.out',
      })
      // Then: set opacity of close lines to 1 and open lines to 0
      .set([closeLine1Ref.current, closeLine2Ref.current], { opacity: 1 }, '-=0.05')
      .set([openLine1Ref.current, openLine2Ref.current, openLine3Ref.current], { opacity: 0 }, '-=0.05')
      // Finally: rotate close lines
      .to(closeLine1Ref.current, { rotation: 45, duration: 0.1, ease: 'power2.out' }, '-=0.05')
      .to(closeLine2Ref.current, { rotation: -45, duration: 0.1, ease: 'power2.out' }, '-=0.1')

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [isPlaceholder])

  // Handle hover scale animation
  useEffect(() => {
    if (!buttonRef.current) return

    if (colorBarRef.current) {
      if (isHover) {
        colorBarRef.current?.animateIn()
      } else {
        colorBarRef.current?.animateOut()
      }
    }
  }, [isHover])

  useEffect(() => {
    if (!timelineRef.current) return

    if (navIsOpen) {
      setIsHover(false)
      timelineRef.current.play()
    } else {
      timelineRef.current.reverse()
    }
  }, [navIsOpen])

  if (isPlaceholder) {
    return <div className={classNames(styles.menuButton, styles.placeholder, className)} />
  }

  return (
    <button
      ref={buttonRef}
      onClick={() => {
        setNavIsOpen(!navIsOpen)
        colorBarRef.current?.animateOut()
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={classNames(styles.menuButton, className, { [styles.open]: navIsOpen })}
      data-nav-theme={theme}
      data-nav-state={navState}
    >
      <div
        ref={openLine1Ref}
        className={classNames(styles.menuButton__line, styles.open)}
      />
      <div
        ref={openLine2Ref}
        className={classNames(styles.menuButton__line, styles.open)}
      />
      <div
        ref={openLine3Ref}
        className={classNames(styles.menuButton__line, styles.open)}
      />
      <div
        ref={closeLine1Ref}
        className={classNames(styles.menuButton__line, styles.close, styles.close1)}
      />
      <div
        ref={closeLine2Ref}
        className={classNames(styles.menuButton__line, styles.close, styles.close2)}
      />
      <ColorBar
        ref={colorBarRef}
        transformOrigin="bottom"
        className={styles.menuButton__colorBar}
      />
    </button>
  )
}

const DesktopLink = ({ link, className, hasArrow }: { link: SanityLink; className?: string; hasArrow?: boolean }) => {
  const arrowButtonRef = useRef<ArrowButtonRef>(null)
  const textSwapperRef = useRef<TextSwapperRef>(null)

  const handleMouseEnter = () => {
    textSwapperRef.current?.swapText()
    if (arrowButtonRef.current) {
      arrowButtonRef.current.setIsHover(true)
    }
  }

  const handleMouseLeave = () => {
    if (arrowButtonRef.current) {
      arrowButtonRef.current.setIsHover(false)
    }
  }

  return (
    <Link
      link={link}
      className={classNames(styles.desktopLink, className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      activeClass={styles.desktopLink__active}
    >
      <TextSwapper
        ref={textSwapperRef}
        className={styles.desktopLink__label}
        label={link.label}
      />
      {hasArrow && (
        <ArrowButton
          ref={arrowButtonRef}
          iconName="arrowDiagonal"
          disableOnHover={true}
          element="span"
          className={styles.desktopLink__arrow}
        />
      )}
    </Link>
  )
}

// MenuLayer component that holds the Menu and forwards refs
const MenuLayer = () => {
  const menuRef = useRef<MenuRef>(null)
  const navIsOpen = useStore(state => state.navIsOpen)
  const maskRevealRef = useRef<MaskRevealRef>(null)
  const menuAnimateInTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const homeLinkLogoRef = useRef<HTMLAnchorElement>(null)
  const lineAnimationRefs = useRef<(LineAnimationRef | null)[]>([])
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const scrollableContentRef = useRef<HTMLDivElement>(null)
  const animateOutCallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isDoneAnimatingOut, setIsDoneAnimatingOut] = useState(true)

  const clearTimeouts = () => {
    if (menuAnimateInTimeoutRef.current) {
      clearTimeout(menuAnimateInTimeoutRef.current)
    }
    if (animateOutCallbackTimeoutRef.current) {
      clearTimeout(animateOutCallbackTimeoutRef.current)
    }
  }

  const animateIn = () => {
    clearTimeouts()

    menuAnimateInTimeoutRef.current = setTimeout(
      () => {
        if (menuRef.current) {
          menuRef.current.animateIn()
        }
      },
      MENU_DURATION * 0.3 * 1000,
    )

    if (maskRevealRef.current) {
      maskRevealRef.current.animateIn()
    }

    // Animate home link logo
    if (homeLinkLogoRef.current) {
      gsap.killTweensOf(homeLinkLogoRef.current)
      gsap.to(homeLinkLogoRef.current, {
        opacity: 1,
        duration: MENU_DURATION,
      })
    }

    if (subtitleRef.current) {
      gsap.killTweensOf(subtitleRef.current)
      gsap.to(subtitleRef.current, {
        opacity: 1,
        duration: MENU_DURATION,
      })
    }
  }

  const animateOut = () => {
    clearTimeouts()

    animateOutCallbackTimeoutRef.current = setTimeout(() => {
      if (scrollableContentRef.current) {
        scrollableContentRef.current.scrollTop = 0
      }
    }, MENU_DURATION * 1000)

    if (menuRef.current) {
      menuRef.current.animateOut()
    }
    if (maskRevealRef.current) {
      maskRevealRef.current.animateOut()
    }

    // Animate home link logo out
    if (homeLinkLogoRef.current) {
      gsap.killTweensOf(homeLinkLogoRef.current)
      gsap.to(homeLinkLogoRef.current, {
        opacity: 0,
        duration: MENU_DURATION * 0.6,
      })
    }

    if (subtitleRef.current) {
      gsap.killTweensOf(subtitleRef.current)
      gsap.to(subtitleRef.current, {
        opacity: 0,
        duration: MENU_DURATION,
      })
    }
  }

  useEffect(() => {
    if (navIsOpen) {
      animateIn()
    } else {
      animateOut()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navIsOpen])

  return (
    <MaskReveal
      ref={maskRevealRef}
      className={classNames(
        styles.menuLayer,
        { [styles.navIsOpen]: navIsOpen },
        { [styles.isDoneAnimatingOut]: isDoneAnimatingOut },
      )}
      inConfig={{
        onStart: () => {
          setIsDoneAnimatingOut(false)
        },
      }}
      outConfig={{
        ease: 'Power3.easeOut',
        onStart: () => {
          setIsDoneAnimatingOut(false)
        },
        onComplete: () => {
          setIsDoneAnimatingOut(true)
        },
      }}
    >
      <div className={styles.menuLayer__header}>
        <div className={styles.menuLayer__headerLogoWrapper}>
          <HomeLinkLogo
            ref={homeLinkLogoRef}
            className={styles.menuLayer__headerLogo}
          />
          <LineAnimation
            ref={el => {
              if (lineAnimationRefs.current) {
                lineAnimationRefs.current[0] = el
              }
            }}
            position="right"
            animateFrom="bottom"
            className={styles.menuLayer__headerLineAnimationUp}
            startFull
          />
        </div>
        <LineAnimation
          ref={el => {
            if (lineAnimationRefs.current) {
              lineAnimationRefs.current[1] = el
            }
          }}
          position="bottom"
          animateFrom="left"
          className={styles.menuLayer__headerLineAnimationAcross}
          inConfig={{
            duration: MENU_LONG_LINE_DURATION,
          }}
          startFull
        />
        <div className={styles.menuLayer__headerHamburgerContainer}>
          <LineAnimation
            ref={el => {
              if (lineAnimationRefs.current) {
                lineAnimationRefs.current[2] = el
              }
            }}
            position="left"
            animateFrom="bottom"
            className={styles.menuLayer__headerLineAnimationUp}
            startFull
          />
        </div>
        <p
          ref={subtitleRef}
          className={styles.menuLayer__headerSubtitle}
        >
          Choose where to navigate
        </p>
      </div>
      <div
        data-lenis-prevent="true"
        ref={scrollableContentRef}
        className={styles.menuLayer__scrollable}
      >
        <Menu
          ref={menuRef}
          hideLogo={true}
        />
      </div>
    </MaskReveal>
  )
}

// MenuBgOverlay component
const MenuBgOverlay = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const navIsOpen = useStore(state => state.navIsOpen)
  const setNavIsOpen = useStore(state => state.setNavIsOpen)

  const animateIn = () => {
    if (!containerRef.current) return
    gsap.killTweensOf(containerRef.current)
    gsap.to(containerRef.current, {
      opacity: 1,
      duration: MENU_DURATION,
    })
  }

  const animateOut = () => {
    if (!containerRef.current) return
    gsap.killTweensOf(containerRef.current)
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: MENU_DURATION * 0.6,
    })
  }

  useEffect(() => {
    if (navIsOpen) {
      animateIn()
    } else {
      animateOut()
    }
  }, [navIsOpen])

  return (
    <div
      ref={containerRef}
      className={classNames(styles.menuBgOverlay, { [styles.navIsOpen]: navIsOpen })}
      onClick={() => {
        setNavIsOpen(false)
      }}
    />
  )
}

NavigationListItem.displayName = 'NavigationListItem'

HamburgerButton.displayName = 'HamburgerButton'

HomeLinkLogo.displayName = 'HomeLinkLogo'

MenuLayer.displayName = 'MenuLayer'

MenuBgOverlay.displayName = 'MenuBgOverlay'

DesktopLink.displayName = 'DesktopLink'

NavigationInner.displayName = 'NavigationInner'

export default NavigationInner
