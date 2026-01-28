import React, { useEffect } from 'react'

const ReplaceLastSpace = ({ text, index, arrayLength }: { text: string; index: number; arrayLength: number }) => {
  if (text.split(' ').length === 1) {
    return text
  }

  const lastIndex = text.lastIndexOf(' ')
  const part1 = text.slice(0, lastIndex)
  let part2 = text.slice(lastIndex + 1)

  const needsSecondLine = index + 1 < arrayLength
  if (needsSecondLine) {
    part2 = `${part2}\n\n`
  }

  if (text.split(' ').length === 2) {
    return <>{text}</>
  }

  return (
    <>
      {part1}&nbsp;{part2}
    </>
  )
}

export default function Widont({ text, log = false }: { text: string; log?: boolean }) {
  const _text = text.trim()

  let textAsArray = [_text]

  if (_text.includes('\n\n')) {
    textAsArray = _text.split('\n\n')
  }

  useEffect(() => {
    if (!log) return

    // eslint-disable-next-line no-console
    console.log({ text })
  }, [log, text])

  if (!text) return null

  return (
    <>
      {textAsArray.map((str, i) => {
        return (
          <React.Fragment key={i}>
            <ReplaceLastSpace
              key={i}
              text={str}
              index={i}
              arrayLength={textAsArray.length}
            />
          </React.Fragment>
        )
      })}
    </>
  )
}
