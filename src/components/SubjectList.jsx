import { TrashIcon } from './icons'

export default function SubjectList({ subjects, tasks, activeFilter, onFilter, onDelete }) {
  if (subjects.length === 0) {
    return <p className="muted small">Ingen fag ennå. Legg til ditt første fag over.</p>
  }

  return (
    <ul className="subject-list">
      {subjects.map((s) => {
        const open = tasks.filter((t) => t.subjectId === s.id && !t.done).length
        const active = activeFilter === s.id
        return (
          <li key={s.id} className={`subject ${active ? 'is-active' : ''}`}>
            <button
              type="button"
              className="subject-main"
              onClick={() => onFilter(active ? 'all' : s.id)}
              aria-pressed={active}
              title={active ? 'Vis alle fag' : `Vis bare ${s.name}`}
            >
              <span className="dot" style={{ background: s.color }} />
              <span className="subject-name">{s.name}</span>
              <span className="badge" title="Åpne oppgaver">{open}</span>
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => onDelete(s.id)}
              aria-label={`Slett faget ${s.name}`}
            >
              <TrashIcon />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
