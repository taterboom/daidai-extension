import { useEffect, useMemo, useState } from "react"

const initLocalstorageState = (key: string) => {
  try {
    const maybeString = localStorage.getItem(key)
    if (!maybeString) return null
    return JSON.parse(maybeString)
  } catch {
    return null
  }
}
export function useLocalstorageState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => initLocalstorageState(key) || defaultValue)
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [state, key])
  return useMemo(() => [state, setState] as const, [state])
}
