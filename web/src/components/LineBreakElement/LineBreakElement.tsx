import React, { useImperativeHandle, useRef } from 'react'

import { LineBreakElementProps } from './LineBreakElement.types'

type ButtonImperativeHandle = {
  getRefs: () => (HTMLSpanElement | null)[]
}

const LineBreakElement = React.forwardRef<ButtonImperativeHandle, LineBreakElementProps>(({ className, text }, ref) => {
  const lineRefs = useRef<(HTMLElement | null)[]>([])

  useImperativeHandle(ref, () => ({
    getRefs: () => {
      return lineRefs.current
    },
  }))

  return (
    <>
      {text.split('\n').map((line, i) => (
        <span
          ref={ref => {
            lineRefs.current[i] = ref
          }}
          className={className}
          key={i}
        >
          {line}
        </span>
      ))}
    </>
  )
})

LineBreakElement.displayName = 'LineBreakElement'

export default LineBreakElement
