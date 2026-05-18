import { useTheme } from '../hooks/useTheme.js'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button type="button" className="center-button" onClick={toggleTheme}>
      {theme === 'dark' ? 'ライトモードに' : 'ダークモードに'}
    </button>
  )
}
