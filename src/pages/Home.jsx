import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Menu from '../components/Menu.jsx'
import Quiz from '../components/Quiz.jsx'
import Result from '../components/Result.jsx'
import YearSelect from '../components/YearSelect.jsx'
import { normalizeQuestion, shuffleArray } from '../lib/quiz.js'
import { supabase } from '../lib/supabase.js'

export default function Home() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('year')
  const [selectedYear, setSelectedYear] = useState('')
  const [questions, setQuestions] = useState([])
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [scoreMap, setScoreMap] = useState({})
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const userId = localStorage.getItem('quiz_user')

  useEffect(() => {
    const year = localStorage.getItem('selected_year')
    if (year) {
      handleSelectYear(year)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSelectYear(year) {
    setSelectedYear(year)
    localStorage.setItem('selected_year', year)
    setScreen('menu')
    setLoading(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('year', year.toLowerCase())
      .order('id', { ascending: true })

    if (error) {
      console.error(error)
      setQuestions([])
      setErrorMessage('問題データの取得に失敗しました。')
      setLoading(false)
      return
    }

    const normalized = (data || []).map(normalizeQuestion)
    setQuestions(normalized)
    setLoading(false)
    await loadScores(normalized)
  }

  async function loadScores(targetQuestions = questions) {
    if (!userId || targetQuestions.length === 0) {
      setScoreMap({})
      return
    }

    const { data, error } = await supabase
      .from('answer_logs')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error(error)
      setScoreMap({})
      return
    }

    const nextScoreMap = {}

    for (let i = 0; i < targetQuestions.length; i += 10) {
      const block = Math.floor(i / 10) + 1
      const questionIds = targetQuestions.slice(i, i + 10).map(question => question.id)
      const logs = (data || []).filter(log => questionIds.includes(log.question_id))

      let bronzeCount = 0
      let silverCount = 0
      let goldCount = 0

      questionIds.forEach(questionId => {
        const correctTimes = logs.filter(log => log.question_id === questionId && log.is_correct).length
        if (correctTimes >= 1) bronzeCount += 1
        if (correctTimes >= 3) silverCount += 1
        if (correctTimes >= 5) goldCount += 1
      })

      nextScoreMap[block] = { bronzeCount, silverCount, goldCount }
    }

    setScoreMap(nextScoreMap)
  }

  function handleStartQuiz(range) {
    if (questions.length === 0) return

    if (range === 'all') {
      setSelectedQuestions(shuffleArray(questions))
    } else if (range === 'random10') {
      setSelectedQuestions(shuffleArray(questions).slice(0, 10))
    } else {
      const [start, end] = range.split('-').map(Number)
      setSelectedQuestions(shuffleArray(questions.slice(start - 1, end)))
    }

    setCorrectCount(0)
    setCurrent(0)
    setScreen('quiz')
  }

  async function handleAnswer({ questionId, isCorrect }) {
    if (isCorrect) {
      setCorrectCount(count => count + 1)
    }

    const { error } = await supabase.from('answer_logs').insert([
      {
        user_id: userId,
        question_id: questionId,
        is_correct: isCorrect
      }
    ])

    if (error) {
      console.error('answer_logs保存エラー', error)
    }

    loadScores()
  }

  function handleNext() {
    if (current + 1 >= selectedQuestions.length) {
      setScreen('result')
    } else {
      setCurrent(index => index + 1)
    }
  }

  function handleBackToYear() {
    localStorage.removeItem('selected_year')
    setSelectedYear('')
    setQuestions([])
    setScoreMap({})
    setScreen('year')
  }

  function handleLogout() {
    localStorage.removeItem('quiz_user')
    localStorage.removeItem('selected_year')
    navigate('/login', { replace: true })
  }

  const title = {
    year: '年度を選択',
    menu: '出題範囲を選択',
    quiz: `問題 (${current + 1}/${selectedQuestions.length})`,
    result: '結果'
  }[screen]

  return (
    <main>
      <h1 id="pageTitle">{title}</h1>

      {screen === 'year' && <YearSelect onSelect={handleSelectYear} />}

      {screen === 'menu' && (
        <>
          {loading && <p>読み込み中...</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {!loading && !errorMessage && (
            <Menu
              questions={questions}
              scoreMap={scoreMap}
              selectedYear={selectedYear}
              onStart={handleStartQuiz}
              onBackToYear={handleBackToYear}
              onLogout={handleLogout}
            />
          )}
        </>
      )}

      {screen === 'quiz' && (
        <Quiz
          questions={selectedQuestions}
          current={current}
          correctCount={correctCount}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      )}

      {screen === 'result' && (
        <Result
          correctCount={correctCount}
          total={selectedQuestions.length}
          onBackToMenu={() => setScreen('menu')}
        />
      )}
    </main>
  )
}
