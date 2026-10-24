import { useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { createId } from './utils/id'
import { isSoon, isOverdue } from './utils/dates'
import SubjectForm from './components/SubjectForm'
import SubjectList from './components/SubjectList'
import TaskForm from './components/TaskForm'
import Overview from './components/Overview'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  const [subjects, setSubjects] = useLocalStorage('studieplanlegger.subjects', [])
  const [tasks, setTasks] = useLocalStorage('studieplanlegger.tasks', [])
  const [filter, setFilter] = useState('all')
  const [theme, setTheme] = useLocalStorage('studieplanlegger.theme', 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const subjectsById = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s.id, s])),
    [subjects],
  )

  const stats = useMemo(() => {
    const open = tasks.filter((t) => !t.done)
    const overdue = open.filter((t) => isOverdue(t.dueDate, t.dueTime))
    return {
      open: open.length,
      soon: open.filter((t) => !overdue.includes(t) && isSoon(t.dueDate)).length,
      overdue: overdue.length,
    }
  }, [tasks])

  function addSubject({ name, color }) {
    setSubjects((prev) => [...prev, { id: createId(), name, color }])
  }

  function deleteSubject(id) {
    const subject = subjectsById[id]
    const count = tasks.filter((t) => t.subjectId === id).length
    const message = count
      ? `Slette «${subject.name}» og ${count} tilknyttede oppgave(r)?`
      : `Slette «${subject.name}»?`
    if (!window.confirm(message)) return
    setSubjects((prev) => prev.filter((s) => s.id !== id))
    setTasks((prev) => prev.filter((t) => t.subjectId !== id))
    if (filter === id) setFilter('all')
  }

  function addTask({ title, subjectId, dueDate, dueTime }) {
    setTasks((prev) => [
      ...prev,
      { id: createId(), title, subjectId, dueDate, dueTime, done: false, createdAt: Date.now() },
    ])
  }

  function toggleTask(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1>Studieplanlegger</h1>
            <p className="subtitle">Hold oversikt over fag og frister</p>
          </div>
          <ThemeToggle
            theme={theme}
            onToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          />
        </div>
        <div className="stats" aria-label="Sammendrag">
          <Stat value={stats.open} label="Åpne" />
          <Stat value={stats.soon} label="Innen 3 dager" tone="warn" />
          <Stat value={stats.overdue} label="Forfalt" tone="danger" />
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <section className="card">
            <h2>Fag</h2>
            <SubjectForm subjects={subjects} onAdd={addSubject} />
            <SubjectList
              subjects={subjects}
              tasks={tasks}
              activeFilter={filter}
              onFilter={setFilter}
              onDelete={deleteSubject}
            />
          </section>

          <section className="card">
            <h2>Ny oppgave</h2>
            <TaskForm subjects={subjects} onAdd={addTask} />
          </section>
        </aside>

        <Overview
          tasks={tasks}
          subjectsById={subjectsById}
          filter={filter}
          onClearFilter={() => setFilter('all')}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </main>
    </div>
  )
}

function Stat({ value, label, tone }) {
  return (
    <div className={`stat ${tone ? `stat-${tone}` : ''}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
