import { useEffect, useMemo, useState } from 'react'
import { createLabeledChoices } from '../lib/quiz.js'
import LineText from './LineText.jsx'

export default function Quiz({ questions, current, correctCount, onAnswer, onNext }) {
  const question = questions[current]
  const [locked, setLocked] = useState(false)
  const [answerResult, setAnswerResult] = useState(null)

  const { shuffledChoices, correctIndex } = useMemo(() => {
    return question ? createLabeledChoices(question) : { shuffledChoices: [], correctIndex: -1 }
  }, [question])

  useEffect(() => {
    setLocked(false)
    setAnswerResult(null)
  }, [current])

  useEffect(() => {
    function handleKey(event) {
      if (locked && event.key === 'Enter') {
        onNext()
        return
      }
      if (!locked && ['1', '2', '3', '4'].includes(event.key)) {
        const index = Number(event.key) - 1
        handleAnswer(index)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [locked, shuffledChoices, correctIndex, current])

  if (!question) {
    return null
  }

  function handleAnswer(selectedIndex) {
    if (locked) return

    const isCorrect = selectedIndex === correctIndex
    setLocked(true)
    setAnswerResult({ isCorrect, selectedIndex })
    onAnswer({ questionId: question.id, isCorrect })
  }

  return (
    <section id="quiz">
      <h3><LineText text={question.question} /></h3>

      {question.image_url && (
        <img className="question-image" src={question.image_url} alt="問題画像" />
      )}

      {shuffledChoices.map((choice, index) => (
        <button
          key={`${choice.label}-${index}`}
          type="button"
          disabled={locked}
          className={locked && index === correctIndex ? 'correct-choice' : ''}
          onClick={() => handleAnswer(index)}
        >
          <span>({index + 1}) <LineText text={choice.text} /></span>
        </button>
      ))}

      <p className="shortcut">※ キーボードの1〜4キーでも選択可能</p>

      {answerResult && (
        <div className="result">
          {answerResult.isCorrect ? (
            <span className="result-text correct-text">正解！</span>
          ) : (
            <>
              <span className="result-text wrong-text">不正解（正解は {correctIndex + 1}）</span>
              <div className="explanation">
                <LineText text={question.explanation || '解説はありません。'} />
              </div>
            </>
          )}
        </div>
      )}

      {locked && (
        <button type="button" className="center-button" onClick={onNext}>次の問題へ</button>
      )}

      <p className="progress-text">正答数：{correctCount}/{questions.length}</p>
    </section>
  )
}
