export const yearOptions = [
  { label: '令和7年度', value: 'R7' },
  { label: '令和6年度', value: 'R6' },
  { label: '令和5年度', value: 'R5' },
  { label: '令和4年度', value: 'R4' },
  { label: '令和3年度', value: 'R3' },
  { label: '令和2年度', value: 'R2' }
]

export function normalizeQuestion(q) {
  return {
    ...q,
    choices: [q.choice_a, q.choice_b, q.choice_c, q.choice_d]
  }
}

export function shuffleArray(array) {
  const copied = [...array]
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copied[i], copied[j]] = [copied[j], copied[i]]
  }
  return copied
}

export function createLabeledChoices(question) {
  const labeledChoices = [
    { label: 'ア', alt: ['A', '1'], text: question.choices?.[0] || '' },
    { label: 'イ', alt: ['B', '2'], text: question.choices?.[1] || '' },
    { label: 'ウ', alt: ['C', '3'], text: question.choices?.[2] || '' },
    { label: 'エ', alt: ['D', '4'], text: question.choices?.[3] || '' }
  ]

  const shuffledChoices = shuffleArray(labeledChoices)
  const correctSymbol = String(question.correct || '').trim().toUpperCase()
  const correctChoice = shuffledChoices.find(
    choice => choice.label === correctSymbol || choice.alt.includes(correctSymbol)
  )

  return {
    shuffledChoices,
    correctIndex: correctChoice ? shuffledChoices.indexOf(correctChoice) : -1
  }
}

export function splitLines(text) {
  return String(text || '').split(/\r\n|\r|\n/g)
}
