'use client'

import { useContext, useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import classNames from 'classnames'
import styles from './Menu.module.scss'
import { GlobalSettingsContext } from '@/context/GlobalSettings'
import useCurrentPage from '@/hooks/use-current-page'
import Link from '@/components/Link/Link'
import Icon from '@/components/Icon/Icon'
import ArrowButton, { ArrowButtonRef } from '@/components/ArrowButton/ArrowButton'
import LineAnimation, { LineAnimationRef } from '@/components/LineAnimation/LineAnimation'
import gsap from 'gsap'
import useBreakpoint from '@/hooks/use-breakpoint'
import LanguageSelect from '@/components/LanguageSelect/LanguageSelect'
import TextSwapper, { TextSwapperRef } from '@/components/TextSwapper/TextSwapper'

export interface MenuProps {
  className?: string
  hideLogo?: boolean
}

export interface MenuRef {
  animateIn: () => void
  animateOut: () => void
}

export const DURATION = 1
const EASE = 'Power3.easeOut'
export const LONG_LINE_DURATION = DURATION
export const LONG_LINE_DELAY = 0.1

const Menu = forwardRef<MenuRef, MenuProps>(({ className, hideLogo = false }, ref) => {
  const { globalSettingsData } = useContext(GlobalSettingsContext)
  const menuData = globalSettingsData?.menu
  const { homeLink } = useCurrentPage()
  const [activePrimaryLink, setActivePrimaryLink] = useState(-1)
  const { isMobile } = useBreakpoint()
  const navigationData = globalSettingsData?.navigation

  // Refs
  const logoWrapperDivRef = useRef<HTMLDivElement>(null)
  const primaryLinkRefs = useRef<(PrimaryLinkRef | null)[]>([])
  const sideLinkRefs = useRef<(SideLinkRef | null)[]>([])
  const lineAnimationRefs = useRef<(LineAnimationRef | null)[]>([])
  const secondaryLinkRefs = useRef<(SecondaryLinkRef | null)[]>([])
  const legalLinksListRef = useRef<HTMLUListElement>(null)
  const legalTextRef = useRef<HTMLParagraphElement>(null)

  const animateIn = () => {
    primaryLinkRefs.current.forEach(link => {
      link?.animateIn()
    })

    if (logoWrapperDivRef.current) {
      gsap.killTweensOf(logoWrapperDivRef.current)
      gsap.to(logoWrapperDivRef.current, { opacity: 1, duration: DURATION, ease: EASE })
    }

    sideLinkRefs.current.forEach(link => {
      link?.animateIn()
    })

    lineAnimationRefs.current.forEach(animation => {
      animation?.animateIn()
    })

    secondaryLinkRefs.current.forEach(link => {
      link?.animateIn()
    })

    if (legalTextRef.current && legalLinksListRef.current) {
      gsap.killTweensOf([legalTextRef.current, legalLinksListRef.current])
      gsap.to([legalTextRef.current, legalLinksListRef.current], { opacity: 1, duration: DURATION, ease: EASE })
    }
  }

  const animateOut = () => {
    primaryLinkRefs.current.forEach(link => {
      link?.animateOut()
    })

    if (logoWrapperDivRef.current) {
      gsap.killTweensOf(logoWrapperDivRef.current)
      gsap.to(logoWrapperDivRef.current, { opacity: 0, duration: DURATION, ease: EASE })
    }

    sideLinkRefs.current.forEach(link => {
      link?.animateOut()
    })

    lineAnimationRefs.current.forEach(animation => {
      animation?.animateOut()
    })

    secondaryLinkRefs.current.forEach(link => {
      link?.animateOut()
    })

    if (legalTextRef.current && legalLinksListRef.current) {
      gsap.killTweensOf([legalTextRef.current, legalLinksListRef.current])
      gsap.to([legalTextRef.current, legalLinksListRef.current], { opacity: 0, duration: DURATION, ease: EASE })
    }
  }

  useImperativeHandle(ref, () => ({
    animateIn,
    animateOut,
  }))

  if (
    !menuData?.secondaryLinks?.length ||
    !menuData?.sideLinks?.length ||
    !menuData?.legalLinks?.length ||
    !menuData?.legalText
  ) {
    return null
  }

  const middleContent = (
    <div className={styles.middleContent}>
      {isMobile && (
        <LineAnimation
          ref={el => {
            if (lineAnimationRefs.current) {
              lineAnimationRefs.current[3] = el
            }
          }}
          position="top"
          animateFrom="left"
          className={styles.middleContent__lineAnimationAcross}
          inConfig={{
            duration: LONG_LINE_DURATION,
            ease: 'Power3.easeInOut',
            delay: LONG_LINE_DELAY,
          }}
          startFull
        />
      )}
      <div className={styles.sideLinksContainer}>
        {isMobile && (
          <LineAnimation
            ref={el => {
              if (lineAnimationRefs.current) {
                lineAnimationRefs.current[4] = el
              }
            }}
            position="left"
            animateFrom="top"
            className={styles.middleContent__lineAnimationDown}
            inConfig={{
              delay: DURATION * 0.6,
            }}
            size="tiny"
            startFull
          />
        )}
        <ul className={styles.sideLinks}>
          {menuData.sideLinks.map((link, index) => {
            const Component = isMobile ? SecondaryLink : SideLink

            return (
              <li
                key={index}
                className={styles.sideLinks__li}
              >
                <Component
                  ref={el => {
                    if (sideLinkRefs.current) {
                      sideLinkRefs.current[index] = el
                    }
                  }}
                  inDelay={index * 0.1}
                  link={link}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )

  const bottomContent = (
    <div className={styles.bottomContent}>
      <LineAnimation
        ref={el => {
          if (lineAnimationRefs.current) {
            lineAnimationRefs.current[0] = el
          }
        }}
        position="top"
        animateFrom="left"
        className={styles.bottomContent__lineAnimationAcross}
        inConfig={{
          duration: LONG_LINE_DURATION,
          ease: 'Power3.easeInOut',
          delay: LONG_LINE_DELAY,
        }}
      />
      <div />
      <ul className={styles.secondaryLinks}>
        <LineAnimation
          ref={el => {
            if (lineAnimationRefs.current) {
              lineAnimationRefs.current[1] = el
            }
          }}
          position="left"
          animateFrom="top"
          className={styles.bottomContent__lineAnimationDown}
          inConfig={{
            delay: DURATION * 0.6,
          }}
          size="tiny"
        />
        {menuData.secondaryLinks.map((link, index) => (
          <li
            key={index}
            className={styles.secondaryLinks__li}
          >
            <SecondaryLink
              ref={el => {
                if (secondaryLinkRefs.current) {
                  secondaryLinkRefs.current[index] = el
                }
              }}
              link={link}
              inDelay={index * 0.1}
            />
          </li>
        ))}
      </ul>
    </div>
  )

  const legalLinks = (
    <ul
      ref={legalLinksListRef}
      className={styles.legalLinks}
    >
      {menuData.legalLinks.map((link, index) => (
        <li
          key={index}
          className={styles.legalLinks__li}
        >
          <LegalLink link={link} />
        </li>
      ))}
    </ul>
  )

  const middleContentRendered = isMobile ? bottomContent : middleContent
  const bottomContentRendered = isMobile ? middleContent : bottomContent

  return (
    <div className={classNames(styles.Menu, className)}>
      <div className={styles.inner}>
        <div className={styles.topContent}>
          <div
            ref={logoWrapperDivRef}
            className={styles.logoWrapperDiv}
          >
            {!hideLogo && (
              <Link
                link={homeLink}
                className={styles.logoWrapper}
              >
                <Icon
                  name={isMobile ? 'logo' : 'logoWithWordmark'}
                  className={styles.logo}
                />
              </Link>
            )}
          </div>

          {!!navigationData && (
            <ul className={styles.primaryLinks}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {navigationData.headerLinksLeftSide.map((item: any, index) => (
                <li
                  key={index}
                  className={styles.primaryLinks__li}
                >
                  <PrimaryLink
                    ref={el => {
                      if (primaryLinkRefs.current) {
                        primaryLinkRefs.current[index] = el
                      }
                    }}
                    activePrimaryLink={activePrimaryLink}
                    index={index}
                    setActivePrimaryLink={setActivePrimaryLink}
                    link={item.link}
                    inConfig={{
                      delay: index * 0.1,
                      duration: DURATION * 1.2,
                    }}
                    outConfig={{
                      delay: (navigationData.headerLinksLeftSide?.length - index) * 0.02,
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {middleContentRendered}

        {bottomContentRendered}

        {isMobile && <>{legalLinks}</>}

        <div className={styles.legalContent}>
          <LineAnimation
            ref={el => {
              if (lineAnimationRefs.current) {
                lineAnimationRefs.current[2] = el
              }
            }}
            position="top"
            animateFrom="left"
            className={styles.bottomContent__lineAnimationAcross}
            inConfig={{
              duration: LONG_LINE_DURATION,
              delay: LONG_LINE_DELAY * 2,
              ease: 'Power3.easeInOut',
            }}
          />

          {!isMobile && <>{legalLinks}</>}

          <p
            ref={legalTextRef}
            className={styles.legalText}
          >
            {menuData.legalText}
          </p>

          {isMobile && (
            <LanguageSelect
              theme="light"
              className={styles.languageSelect}
            />
          )}

          {isMobile && (
            <LineAnimation
              ref={el => {
                if (lineAnimationRefs.current) {
                  lineAnimationRefs.current[5] = el
                }
              }}
              position="bottom"
              animateFrom="left"
              className={styles.bottomContent__lineAnimationAcross__bottom}
              startFull
              inConfig={{
                duration: LONG_LINE_DURATION,
                delay: LONG_LINE_DELAY * 2,
                ease: 'Power3.easeInOut',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
})

Menu.displayName = 'Menu'

export interface PrimaryLinkProps {
  index: number
  link: SanityLink
  className?: string
  activePrimaryLink: number
  setActivePrimaryLink: (index: number) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inConfig?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outConfig?: any
}

export interface PrimaryLinkRef {
  animateIn: () => void
  animateOut: () => void
}

const PrimaryLink = forwardRef<PrimaryLinkRef, PrimaryLinkProps>(
  ({ activePrimaryLink, index, setActivePrimaryLink, link, className, inConfig, outConfig }, ref) => {
    const arrowButtonRef = useRef<ArrowButtonRef>(null)
    const textRef = useRef<HTMLSpanElement>(null)
    const linkRef = useRef<HTMLAnchorElement>(null)
    const textSwapperRef = useRef<TextSwapperRef>(null)

    const duration = 0.8
    const ease = 'Power3.easeOut'

    useImperativeHandle(ref, () => ({
      animateIn: () => {
        if (!textRef.current) return
        gsap.killTweensOf(textRef.current)
        gsap.to(textRef.current, { y: 0, duration, ease, ...inConfig })
      },
      animateOut: () => {
        if (!textRef.current) return
        gsap.killTweensOf(textRef.current)
        gsap.to(textRef.current, { y: '110%', duration: duration * 0.5, ease, ...outConfig })
      },
    }))

    const handleMouseEnter = () => {
      setActivePrimaryLink(index)
      textSwapperRef.current?.swapText()
      arrowButtonRef.current?.setIsHover(true)
    }

    const handleMouseLeave = () => {
      setActivePrimaryLink(-1)
      arrowButtonRef.current?.setIsHover(false)
    }

    return (
      <div
        className={classNames(
          styles.primaryLinkWrapper,
          { [styles.active]: activePrimaryLink === index },
          {
            [styles.noneHovered]: activePrimaryLink === -1,
          },
        )}
      >
        <Link
          link={link}
          className={classNames(styles.primaryLink, className)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={linkRef}
          activeClass={styles.activeLink}
        >
          <span
            ref={textRef}
            className={styles.primaryLink__label}
          >
            <TextSwapper
              ref={textSwapperRef}
              label={link.label}
            />
          </span>
          <ArrowButton
            ref={arrowButtonRef}
            iconName="arrowRight"
            className={styles.primaryLink__arrow}
            disableOnHover={true}
            element="span"
            onlyShowHiddenOnHover={true}
          />
        </Link>
      </div>
    )
  },
)

PrimaryLink.displayName = 'PrimaryLink'

export interface SecondaryLinkProps {
  link: SanityLink
  className?: string
  inDelay?: number
}

export interface SecondaryLinkRef {
  animateIn: () => void
  animateOut: () => void
}

const SecondaryLink = forwardRef<SecondaryLinkRef, SecondaryLinkProps>(({ link, className, inDelay = 0 }, ref) => {
  const arrowButtonRef = useRef<ArrowButtonRef>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const textSwapperRef = useRef<TextSwapperRef>(null)

  useImperativeHandle(ref, () => ({
    animateIn: () => {
      const arrowButtonElement = arrowButtonRef.current?.getElement()
      if (arrowButtonElement) {
        gsap.killTweensOf(arrowButtonElement)
        gsap.to(arrowButtonElement, { opacity: 1, duration: DURATION, ease: EASE, delay: inDelay })
      }
      if (textRef.current) {
        gsap.killTweensOf(textRef.current)
        gsap.to(textRef.current, { y: 0, duration: DURATION, ease: EASE, delay: inDelay })
      }
    },
    animateOut: () => {
      const arrowButtonElement = arrowButtonRef.current?.getElement()
      if (arrowButtonElement) {
        gsap.killTweensOf(arrowButtonElement)
        gsap.to(arrowButtonElement, { opacity: 0, duration: DURATION * 0.4, ease: EASE })
      }
      if (textRef.current) {
        gsap.killTweensOf(textRef.current)
        gsap.to(textRef.current, { y: '110%', duration: DURATION, ease: EASE })
      }
    },
  }))

  const handleMouseEnter = () => {
    textSwapperRef.current?.swapText()
    arrowButtonRef.current?.setIsHover(true)
  }

  const handleMouseLeave = () => {
    arrowButtonRef.current?.setIsHover(false)
  }

  return (
    <div className={styles.secondaryLinkWrapper}>
      <Link
        link={link}
        className={classNames(styles.secondaryLink, className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ArrowButton
          ref={arrowButtonRef}
          iconName="arrowRight"
          className={styles.secondaryLink__arrow}
          disableOnHover={true}
          element="span"
        />
        <span className={styles.secondaryLink__label}>
          <span
            className={styles.secondaryLink__labelText}
            ref={textRef}
          >
            <TextSwapper
              ref={textSwapperRef}
              label={link.label}
            />
          </span>
        </span>
      </Link>
    </div>
  )
})

SecondaryLink.displayName = 'SecondaryLink'

export interface SideLinkProps {
  link: SanityLink
  className?: string
}

export interface SideLinkRef {
  animateIn: () => void
  animateOut: () => void
}

const SideLink = forwardRef<SideLinkRef, SideLinkProps>(({ link, className }, ref) => {
  const arrowButtonRef = useRef<ArrowButtonRef>(null)
  const lineAnimationRef = useRef<LineAnimationRef>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const lineAnimationRightHoverRef = useRef<LineAnimationRef>(null)
  const lineAnimationBottomHoverRef = useRef<LineAnimationRef>(null)
  const [isHover, setIsHover] = useState(false)
  const textSwapperRef = useRef<TextSwapperRef>(null)

  useImperativeHandle(ref, () => ({
    animateIn: () => {
      if (lineAnimationRef.current) {
        lineAnimationRef.current.animateIn()
      }

      if (textRef.current) {
        gsap.killTweensOf(textRef.current)
        gsap.to(textRef.current, { y: 0, duration: DURATION, ease: EASE })
      }

      const arrowButtonElement = arrowButtonRef.current?.getElement()
      if (arrowButtonElement) {
        gsap.killTweensOf(arrowButtonElement)
        gsap.to(arrowButtonElement, { opacity: 1, duration: DURATION, ease: EASE })
      }
    },
    animateOut: () => {
      if (lineAnimationRef.current) {
        lineAnimationRef.current.animateOut()
      }

      if (textRef.current) {
        gsap.killTweensOf(textRef.current)
        gsap.to(textRef.current, { y: '110%', duration: DURATION, ease: EASE })
      }

      const arrowButtonElement = arrowButtonRef.current?.getElement()
      if (arrowButtonElement) {
        gsap.killTweensOf(arrowButtonElement)
        gsap.to(arrowButtonElement, { opacity: 0, duration: DURATION * 0.8, ease: EASE })
      }
    },
  }))

  const handleMouseEnter = () => {
    setIsHover(true)
    textSwapperRef.current?.swapText()
    arrowButtonRef.current?.setIsHover(true)
  }

  const handleMouseLeave = () => {
    setIsHover(false)
    arrowButtonRef.current?.setIsHover(false)
  }

  useEffect(() => {
    if (lineAnimationRightHoverRef.current) {
      lineAnimationRightHoverRef.current[isHover ? 'animateIn' : 'animateOut']()
    }
    if (lineAnimationBottomHoverRef.current) {
      lineAnimationBottomHoverRef.current[isHover ? 'animateIn' : 'animateOut']()
    }
  }, [isHover])

  return (
    <div className={styles.sideLinkWrapper}>
      <Link
        link={link}
        className={classNames(styles.sideLink, className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={styles.sideLink__label}>
          <span
            ref={textRef}
            className={styles.sideLink__labelText}
          >
            <TextSwapper
              ref={textSwapperRef}
              label={link.label}
            />
          </span>
        </span>
        <ArrowButton
          ref={arrowButtonRef}
          iconName="arrowDiagonal"
          className={styles.sideLink__arrow}
          disableOnHover={true}
          element="span"
        />
        <LineAnimation
          ref={lineAnimationRef}
          position="right"
          animateFrom="bottom"
          className={styles.sideLink__rightLine}
        />
        <LineAnimation
          ref={lineAnimationRightHoverRef}
          position="right"
          animateFrom="bottom"
          className={styles.sideLink__rightLineHover}
        />
        <LineAnimation
          ref={lineAnimationBottomHoverRef}
          position="bottom"
          animateFrom="right"
          className={styles.sideLink__bottomLineHover}
        />
      </Link>
    </div>
  )
})

SideLink.displayName = 'SideLink'

export interface LegalLinkProps {
  link: SanityLink
  className?: string
}

const LegalLink = ({ link, className }: LegalLinkProps) => {
  const textSwapperRef = useRef<TextSwapperRef>(null)

  const handleMouseEnter = () => {
    textSwapperRef.current?.swapText()
  }

  return (
    <div className={styles.legalLinkWrapper}>
      <Link
        link={link}
        className={classNames(styles.legalLink, className)}
        onMouseEnter={handleMouseEnter}
      >
        <span className={styles.legalLink__label}>
          <TextSwapper
            ref={textSwapperRef}
            label={link.label}
          />
        </span>
      </Link>
    </div>
  )
}

LegalLink.displayName = 'LegalLink'

export default Menu
