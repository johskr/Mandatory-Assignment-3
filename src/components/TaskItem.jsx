import { daysUntil, formatDate, isSoon, relativeLabel } from '../utils/dates'
import { TrashIcon } from './icons'

export default function TaskItem({ task, subject, onToggle, onDelete }) {
  const overdue = !task.done && daysUntil(task.dueDate) < 0
  const soon = !task.done && isSoon(task.dueDate)

  const classes = ['task']
  if (task.done) classes.push('is-done')
  if (soon) classes.push('is-soon')
  if (overdue) classes.push('is-overdue')

  let status = relativeLabel(task.dueDate)
  if (task.done) status = 'Ferdig'
  else if (overdue) status = `Forfalt · ${status.toLowerCase()}`

  return (
    <li className={classes.join(' ')} style={{ '--subject': subject?.color ?? '#94a3b8' }}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggle(task.id)}
          aria-label={task.done ? `Marker «${task.title}» som ikke ferdig` : `Marker «${task.title}» som ferdig`}
        />
        <span className="checkmark" aria-hidden="true" />
      </label>

      <div className="task-body">
        <span className="task-title">{task.title}</span>
        <span className="task-meta">
          <span className="dot" style={{ background: subject?.color }} />
          {subject?.name ?? 'Ukjent fag'}
        </span>
      </div>

      <div className="task-date">
        <span className="task-relative">{status}</span>
        <span className="task-absolute">{formatDate(task.dueDate)}</span>
      </div>

      <button
        type="button"
        className="icon-btn"
        onClick={() => onDelete(task.id)}
        aria-label={`Slett oppgaven ${task.title}`}
      >
        <TrashIcon />
      </button>
    </li>
  )
}
