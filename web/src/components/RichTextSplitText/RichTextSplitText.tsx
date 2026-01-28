'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { PortableTextReactComponents } from '@portabletext/react'

import SplitTextComponent, {
  SplitTextComponentProps,
  SplitTextRef,
} from '@/components/SplitTextComponent/SplitTextComponent'
import RichText from '@/components/RichText/RichText'

export interface RichTextSplitTextRef {
  getRefs: () => (SplitTextRef | null)[]
  animateIn: () => void
  animateOut: () => void
}

interface RichTextSplitTextProps {
  className?: string
  content: SanityContentBlockProps[]
  serializer?: Partial<PortableTextReactComponents>
  splitTextProps?: Omit<SplitTextComponentProps, 'children'>
  inDelay?: number
  debug?: boolean
  revertOnAnimateIn?: boolean
}

const RichTextSplitText = forwardRef<RichTextSplitTextRef, RichTextSplitTextProps>(
  (
    { className, content, serializer, splitTextProps, inDelay = 0.2, debug = false, revertOnAnimateIn = false },
    ref,
  ) => {
    const splitTextRefs = useRef<(SplitTextRef | null)[]>([])
    const splitTextDelayTimeouts = useRef<NodeJS.Timeout[]>([])

    const clearAllTimeouts = () => {
      splitTextDelayTimeouts.current.forEach(timeout => {
        clearTimeout(timeout)
      })
      splitTextDelayTimeouts.current = []
    }

    useImperativeHandle(ref, () => ({
      getRefs: () => splitTextRefs.current,
      animateIn: () => {
        clearAllTimeouts()
        if (debug) {
          console.warn('animateIn')
        }
        splitTextRefs.current.forEach((splitTextRef, index) => {
          splitTextDelayTimeouts.current.push(
            setTimeout(
              () => {
                if (splitTextRef) {
                  splitTextRef.animateIn()
                }
              },
              index * inDelay * 1000,
            ),
          )
        })
      },
      animateOut: () => {
        if (debug) {
          console.warn('animateOut')
        }
        clearAllTimeouts()
        splitTextRefs.current.forEach(splitTextRef => {
          if (splitTextRef) {
            splitTextRef.animateOut()
          }
        })
      },
    }))

    if (!content?.length) {
      return null
    }

    return (
      <div className={className}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {content.map((block: any, index: number) => (
          <SplitTextComponent
            key={`${block._key}_splitText__${index}`}
            ref={_ref => {
              if (_ref) {
                splitTextRefs.current[index] = _ref
              }
            }}
            {...{ ...splitTextProps, revertOnAnimateIn: revertOnAnimateIn || false }}
            debug={debug}
          >
            <RichText
              content={[block]}
              serializer={serializer}
            />
          </SplitTextComponent>
        ))}
      </div>
    )
  },
)

RichTextSplitText.displayName = 'RichTextSplitText'

export default RichTextSplitText
