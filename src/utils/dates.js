export const SOON_THRESHOLD_DAYS = 3

// Tolker "YYYY-MM-DD" som lokal dato (new Date("YYYY-MM-DD") gir UTC)
export function parseDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toISO(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayISO() {
  return toISO(new Date())
}

// Dato et antall dager fra i dag (negativt tall gir en dato bakover i tid)
export function offsetISO(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return toISO(date)
}

export function daysUntil(isoDate) {
  const today = parseDate(todayISO())
  const due = parseDate(isoDate)
  return Math.round((due - today) / 86_400_000)
}

export function isSoon(isoDate) {
  const days = daysUntil(isoDate)
  return days >= 0 && days <= SOON_THRESHOLD_DAYS
}

function currentTime() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`
}

// Klokkeslett er valgfritt: uten klokkeslett gjelder fristen ut dagen
export function isOverdue(isoDate, time) {
  const days = daysUntil(isoDate)
  if (days < 0) return true
  return days === 0 && Boolean(time) && time < currentTime()
}

export function relativeLabel(isoDate) {
  const days = daysUntil(isoDate)
  if (days < -1) return `${-days} dager siden`
  if (days === -1) return 'I går'
  if (days === 0) return 'I dag'
  if (days === 1) return 'I morgen'
  return `Om ${days} dager`
}

const formatter = new Intl.DateTimeFormat('nb-NO', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

export function formatDate(isoDate) {
  return formatter.format(parseDate(isoDate))
}
