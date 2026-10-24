import { createId } from './id'
import { offsetISO } from './dates'

const SUBJECTS = [
  { key: 'dave', name: 'DAVE3625', color: '#ef4444' },
  { key: 'webapp', name: 'ITPE3200', color: '#0ea5e9' },
  { key: 'os', name: 'ITPE3100', color: '#10b981' },
]

// Datoer er dager fra i dag, så dataene alltid inneholder én forfalt frist,
// flere innen 3 dager, noen lenger frem og én ferdig oppgave
const TASKS = [
  { subject: 'dave', title: 'Mandatory Assignment 2', days: -6, time: '23:59', done: true },
  { subject: 'dave', title: 'Lab 2: Data visualization', days: -2, time: null },
  { subject: 'dave', title: 'Mandatory Assignment 3', days: 1, time: '23:55' },
  { subject: 'webapp', title: 'Group meeting: project plan', days: 2, time: '15:00' },
  { subject: 'os', title: 'Quiz 4', days: 3, time: null },
  { subject: 'os', title: 'Mandatory Assignment 3', days: 5, time: null },
  { subject: 'webapp', title: 'Project status report', days: 12, time: '12:00' },
  { subject: 'webapp', title: 'Exam Group Project', days: 37, time: '12:00' },
]

export function createSampleData() {
  const ids = {}
  const subjects = SUBJECTS.map(({ key, name, color }) => {
    ids[key] = createId()
    return { id: ids[key], name, color }
  })

  const now = Date.now()
  const tasks = TASKS.map((t, i) => ({
    id: createId(),
    title: t.title,
    subjectId: ids[t.subject],
    dueDate: offsetISO(t.days),
    dueTime: t.time,
    done: Boolean(t.done),
    createdAt: now + i,
  }))

  return { subjects, tasks }
}
