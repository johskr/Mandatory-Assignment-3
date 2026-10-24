import { MoonIcon, SunIcon } from './icons'

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  const label = isDark ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'

  return (
    <button type="button" className="theme-toggle" onClick={onToggle} aria-label={label} title={label}>
      {isDark ? <SunIcon /> : <MoonIcon />}
      <span>{isDark ? 'Lyst' : 'Mørkt'}</span>
    </button>
  )
}
