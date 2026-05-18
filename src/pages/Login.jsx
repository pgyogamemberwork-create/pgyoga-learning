import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { supabase } from '../lib/supabase.js'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (!email.trim() || !password.trim()) {
      setMessage('メールとパスワードを入力してください。')
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim()
    })
    setLoading(false)

    if (error) {
      console.error(error)
      setMessage('メールまたはパスワードが違います')
      return
    }

    localStorage.setItem('quiz_user', data.user.id)
    navigate('/', { replace: true })
  }

  return (
    <main>
      <h1 id="pageTitle">ログイン</h1>
      <form id="loginScreen" onSubmit={handleSubmit}>
        <p>メールアドレスとパスワードを入力してください：</p>
        <input
          type="email"
          value={email}
          placeholder="メールアドレス"
          autoComplete="email"
          onChange={event => setEmail(event.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="パスワード"
          autoComplete="current-password"
          onChange={event => setPassword(event.target.value)}
        />
        <button type="submit" disabled={loading}>{loading ? 'ログイン中...' : 'ログイン'}</button>
        <ThemeToggle />
        {message && <p className="error-message">{message}</p>}
      </form>
    </main>
  )
}
