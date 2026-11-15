import { useState, useEffect, useCallback } from 'react'

/**
 * Reusable local storage hook with auto JSON serialization
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved === null) return initialValue
      try {
        return JSON.parse(saved)
      } catch {
        return saved
      }
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key)
      } else {
        const itemToSave = typeof value === 'string' ? value : JSON.stringify(value)
        localStorage.setItem(key, itemToSave)
      }
    } catch (err) {
      console.error(`Error saving localStorage key "${key}":`, err)
    }
  }, [key, value])

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setValue(initialValue)
    } catch (err) {
      console.error(`Error removing localStorage key "${key}":`, err)
    }
  }, [key, initialValue])

  return [value, setValue, removeValue]
}

export default useLocalStorage
