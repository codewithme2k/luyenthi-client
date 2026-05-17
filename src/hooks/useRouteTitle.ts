import { useEffect } from 'react'
import { useMatches } from 'react-router'

export function useRouteTitle() {
  const matches = useMatches()

  useEffect(() => {
    // Find the deepest route match that has a defined title
    const currentMatch = [...matches].reverse().find((m) => (m.handle as any)?.title)
    if (currentMatch) {
      document.title = `${(currentMatch.handle as any).title} | Luyện Thi`
    } else {
      document.title = 'Luyện Thi Online'
    }
  }, [matches])
}
