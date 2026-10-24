import { useEffect, useState } from 'react'

// useState som synkroniseres med localStorage. Faller tilbake til
// initialValue hvis lagringen er tom, ødelagt eller utilgjengelig.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Privat modus eller full lagring – appen fungerer fortsatt i minnet
    }
  }, [key, value])

  return [value, setValue]
}
