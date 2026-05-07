import { useMemo } from "react"
import { ChoreWithUIStatus } from "../hooks/useChores"

export type ViewMode = "day" | "week" | "month"

export type WeekDates = Record<string, Date>

const DAYS = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"]

/**
 * Builds a Monday-based week with offset
 */
export const getWeekDates = (offset = 0): WeekDates => {
  const now = new Date()
  now.setDate(now.getDate() + offset * 7)

  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)

  const monday = new Date(now.setDate(diff))

  const week: WeekDates = {}

  DAYS.forEach((day, i) => {
    const date = new Date(monday)
    date.setDate(date.getDate() + i)
    week[day] = date
  })

  return week
}

/**
 * CENTRAL CALENDAR ENGINE
 * All filtering + grouping lives here
 */
export const useChoreCalendar = (
  chores: ChoreWithUIStatus[],
  weekOffset: number
) => {
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset])

  const today = useMemo(() => new Date().toDateString(), [])

  const todayChores = useMemo(() => {
    return chores.filter(
      (c) => new Date(c.createdAt).toDateString() === today
    )
  }, [chores, today])

  const monthChores = useMemo(() => {
    const now = new Date()

    return chores.filter((c) => {
      const d = new Date(c.createdAt)
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      )
    })
  }, [chores])

  const choresByWeekDay = useMemo(() => {
    const grouped: Record<string, ChoreWithUIStatus[]> = {
      Mån: [],
      Tis: [],
      Ons: [],
      Tors: [],
      Fre: [],
      Lör: [],
      Sön: [],
    }

    chores.forEach((chore) => {
      const choreDate = new Date(chore.createdAt).toDateString()

      for (const [day, date] of Object.entries(weekDates)) {
        if (choreDate === date.toDateString()) {
          grouped[day].push(chore)
        }
      }
    })

    return grouped
  }, [chores, weekDates])

  const choresBySelectedDate = (date: Date | null) => {
    if (!date) return []

    return chores.filter(
      (c) => new Date(c.createdAt).toDateString() === date.toDateString()
    )
  }

  return {
    weekDates,
    todayChores,
    monthChores,
    choresByWeekDay,
    choresBySelectedDate,
  }
}