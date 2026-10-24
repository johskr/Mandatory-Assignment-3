import { useState } from 'react'
import TaskItem from './TaskItem'
import { SOON_THRESHOLD_DAYS } from '../utils/dates'

// Oppgaver uten klokkeslett gjelder ut dagen, så de sorteres sist den dagen
const timeKey = (t) => t.dueTime || '24:00'

const byDueDate = (a, b) =>
  a.dueDate.localeCompare(b.dueDate) ||
  timeKey(a).localeCompare(timeKey(b)) ||
  (a.createdAt ?? 0) - (b.createdAt ?? 0)

export default function Overview({ tasks, subjectsById, filter, onClearFilter, onToggle, onDelete }) {
  const [showDone, setShowDone] = useState(false)

  const visible = tasks.filter((t) => filter === 'all' || t.subjectId === filter)
  const upcoming = visible.filter((t) => !t.done).sort(byDueDate)
  const done = visible.filter((t) => t.done).sort(byDueDate).reverse()
  const activeSubject = filter !== 'all' ? subjectsById[filter] : null

  const renderItem = (t) => (
    <TaskItem
      key={t.id}
      task={t}
      subject={subjectsById[t.subjectId]}
      onToggle={onToggle}
      onDelete={onDelete}
    />
  )

  return (
    <section className="card overview">
      <div className="overview-header">
        <h2>Kommende frister</h2>
        {activeSubject && (
          <button type="button" className="chip" onClick={onClearFilter}>
            <span className="dot" style={{ background: activeSubject.color }} />
            {activeSubject.name}
            <span aria-hidden="true">×</span>
            <span className="sr-only">Fjern filter</span>
          </button>
        )}
      </div>
      <p className="muted small">
        Sortert etter dato. Frister innen {SOON_THRESHOLD_DAYS} dager er uthevet.
      </p>

      {upcoming.length === 0 ? (
        <div className="empty">
          <p>Ingen kommende frister 🎉</p>
          <p className="muted small">Nye oppgaver dukker opp her.</p>
        </div>
      ) : (
        <ul className="task-list">{upcoming.map(renderItem)}</ul>
      )}

      {done.length > 0 && (
        <div className="done-section">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowDone((v) => !v)}
            aria-expanded={showDone}
          >
            {showDone ? 'Skjul' : 'Vis'} ferdige ({done.length})
          </button>
          {showDone && <ul className="task-list">{done.map(renderItem)}</ul>}
        </div>
      )}
    </section>
  )
}
