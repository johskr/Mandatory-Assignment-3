import { useState } from 'react'

const PRESET_COLORS = [
  '#4f46e5', '#0ea5e9', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#8b5cf6', '#64748b',
]

const MAX_NAME_LENGTH = 40

export default function SubjectForm({ subjects, onAdd }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Fagnavn kan ikke være tomt.')
      return
    }
    if (subjects.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Du har allerede et fag med dette navnet.')
      return
    }
    onAdd({ name: trimmed, color })
    setName('')
    setError('')
    // Velg neste farge automatisk så nye fag blir lette å skille fra hverandre
    const index = PRESET_COLORS.indexOf(color)
    setColor(PRESET_COLORS[(index + 1) % PRESET_COLORS.length])
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span className="field-label field-label-row">
          Navn
          <span className="counter">{name.length}/{MAX_NAME_LENGTH}</span>
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (error) setError('')
          }}
          placeholder="F.eks. Kunstig intelligens"
          maxLength={MAX_NAME_LENGTH}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'subject-error' : undefined}
        />
      </label>

      <fieldset className="field">
        <legend className="field-label">Farge</legend>
        <div className="swatches">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`swatch ${c === color ? 'is-selected' : ''}`}
              style={{ '--swatch': c }}
              onClick={() => setColor(c)}
              aria-label={`Velg farge ${c}`}
              aria-pressed={c === color}
            />
          ))}
          <label
            className={`swatch swatch-custom ${PRESET_COLORS.includes(color) ? '' : 'is-selected'}`}
            style={PRESET_COLORS.includes(color) ? undefined : { '--swatch': color }}
            title="Egendefinert farge"
          >
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Egendefinert farge"
            />
          </label>
        </div>
      </fieldset>

      {error && <p id="subject-error" className="error" role="alert">{error}</p>}

      <button type="submit" className="btn btn-primary">Legg til fag</button>
    </form>
  )
}
