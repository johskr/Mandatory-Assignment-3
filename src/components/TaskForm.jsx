import { useState } from 'react'
import { todayISO } from '../utils/dates'

export default function TaskForm({ subjects, onAdd }) {
  const [title, setTitle] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState({})

  if (subjects.length === 0) {
    return <p className="muted small">Legg til et fag først, så kan du registrere oppgaver og frister.</p>
  }

  // Hvis valgt fag er slettet (eller ingen er valgt), bruk det første
  const selectedSubject = subjects.some((s) => s.id === subjectId) ? subjectId : subjects[0].id

  function handleSubmit(e) {
    e.preventDefault()
    const next = {}
    if (!title.trim()) next.title = 'Oppgaven må ha et navn.'
    if (!dueDate) next.dueDate = 'Oppgaven må ha en frist.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    onAdd({ title: title.trim(), subjectId: selectedSubject, dueDate })
    setTitle('')
    setDueDate('')
  }

  function clearError(field) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span className="field-label">Oppgave</span>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            clearError('title')
          }}
          placeholder="F.eks. Innlevering 3"
          maxLength={100}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <span className="error" role="alert">{errors.title}</span>}
      </label>

      <div className="field-row">
        <label className="field">
          <span className="field-label">Fag</span>
          <select value={selectedSubject} onChange={(e) => setSubjectId(e.target.value)}>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Frist</span>
          <input
            type="date"
            value={dueDate}
            min={todayISO()}
            onChange={(e) => {
              setDueDate(e.target.value)
              clearError('dueDate')
            }}
            aria-invalid={Boolean(errors.dueDate)}
          />
          {errors.dueDate && <span className="error" role="alert">{errors.dueDate}</span>}
        </label>
      </div>

      <button type="submit" className="btn btn-primary">Legg til oppgave</button>
    </form>
  )
}
