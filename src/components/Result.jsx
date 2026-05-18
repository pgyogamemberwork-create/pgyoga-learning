export default function Result({ correctCount, total, onBackToMenu }) {
  return (
    <section>
      <h3>終了！お疲れさま🎉</h3>
      <p>正答数：{correctCount}/{total}</p>
      <button type="button" onClick={onBackToMenu}>メニューに戻る</button>
    </section>
  )
}
