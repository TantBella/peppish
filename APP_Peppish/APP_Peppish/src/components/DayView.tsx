import { useMemo } from "react"
import { ChoreWithUIStatus } from "../hooks/useChores"
import { ChoreCardWrapper } from "./ChoreCardWrapper"

type Props = {
  chores: ChoreWithUIStatus[]
  userId?: string
  expandedChoreId: string | null
  setExpandedChoreId: (id: string | null) => void
}

export const DayView = ({
  chores,
  userId,
  expandedChoreId,
  setExpandedChoreId,
}: Props) => {
  const today = new Date().toDateString()

  const todayChores = useMemo(() => {
    return chores.filter(
      (c) => new Date(c.createdAt).toDateString() === today
    )
  }, [chores, today])

  return (
    <div className="single-list">
      {todayChores.length === 0 ? (
        <p className="no-chores">No chores today</p>
      ) : (
        todayChores.map((chore) => (
          <ChoreCardWrapper
            key={chore.id}
            chore={chore}
            userId={userId}
            expandedChoreId={expandedChoreId}
            setExpandedChoreId={setExpandedChoreId}
          />
        ))
      )}
    </div>
  )
}