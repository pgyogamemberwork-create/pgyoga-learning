import ThemeToggle from './ThemeToggle.jsx'

function createRanges(total) {
  const ranges = []
  for (let i = 0; i < total; i += 10) {
    ranges.push({ start: i + 1, end: Math.min(i + 10, total) })
  }
  return ranges
}

export default function Menu({ questions, scoreMap, onStart, onBackToYear, onLogout }) {
  const ranges = createRanges(questions.length)

  return (
    <section>
      <h3>出題範囲を選択</h3>
      <button type="button" onClick={() => onStart('all')}>全問題</button>
      <button type="button" onClick={() => onStart('random10')}>ランダム10問</button>
      <hr />
      <div id="rangeButtons">
        {ranges.map((range, index) => {
          const block = index + 1
          const medals = scoreMap[block] || { bronzeCount: 0, silverCount: 0, goldCount: 0 }
          const total = range.end - range.start + 1
          const medalText = [
            medals.bronzeCount > 0 ? `🥉${medals.bronzeCount}/${total}` : '',
            medals.silverCount > 0 ? `🥈${medals.silverCount}/${total}` : '',
            medals.goldCount > 0 ? `🥇${medals.goldCount}/${total}` : ''
          ].filter(Boolean).join(' ')

          return (
            <button key={`${range.start}-${range.end}`} type="button" onClick={() => onStart(`${range.start}-${range.end}`)}>
              <span>{range.start}〜{range.end}問</span>
              <span className="score">{medalText}</span>
            </button>
          )
        })}
      </div>
      <hr />
      <button type="button" onClick={onBackToYear}>年度選択に戻る</button>
      <ThemeToggle />
      <button type="button" onClick={onLogout}>ログアウト</button>
    </section>
  )
}
