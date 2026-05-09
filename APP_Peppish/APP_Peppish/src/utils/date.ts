export const getWeekDates = (offset = 0) => {
  const now = new Date()
  now.setDate(now.getDate() + offset * 7)

  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))

  const weekDates: Record<string, Date> = {}
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(date.getDate() + i)
    weekDates[days[i]] = date
  }

  return weekDates
}