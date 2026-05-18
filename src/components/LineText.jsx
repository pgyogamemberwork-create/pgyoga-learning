import { splitLines } from '../lib/quiz.js'

export default function LineText({ text }) {
  return (
    <>
      {splitLines(text).map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < splitLines(text).length - 1 && <br />}
        </span>
      ))}
    </>
  )
}
