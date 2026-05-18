import { yearOptions } from '../lib/quiz.js'

export default function YearSelect({ onSelect }) {
  return (
    <section>
      <h3>年度を選択してください</h3>
      {yearOptions.map(year => (
        <button key={year.value} type="button" onClick={() => onSelect(year.value)}>
          {year.label}
        </button>
      ))}
    </section>
  )
}
