// import { useMemo } from "react"
import { ChoreWithUIStatus } from "../hooks/useChores"
import { ChoreCardWrapper } from "./ChoreCardWrapper"

type Props = {
  chores: ChoreWithUIStatus[]
  userId?: string
  selectedDate: Date | null
  expandedChoreId: string | null
  setExpandedChoreId: (id: string | null) => void
}

export const DayView = ({
  chores,
  userId,
  selectedDate,
  expandedChoreId,
  setExpandedChoreId,
}: Props) => {
  const targetDate = selectedDate ?? new Date()
 

  const filtered = chores.filter(
    (c) => new Date(c.createdAt).toDateString() === targetDate.toDateString()
  )

  // const todayChores = useMemo(() => {
  //   return chores.filter(
  //     (c) => new Date(c.createdAt).toDateString() === today
  //   )
  // }, [chores, today])

  return (
      <>
       <div className="single-list">
      {filtered.length === 0 ? (
        <div className="no-chores">
        <p >Inga quests denna dag.
          </p>
          <p>
            
        Du får kika på en annan dag eller kolla listan för frivilliga quests 🌈</p>
          </div>
      ) : (
        filtered.map((chore) => (
          <ChoreCardWrapper
            key={chore.id}
            chore={chore}
            userId={userId}
            expandedChoreId={expandedChoreId}
            setExpandedChoreId={setExpandedChoreId}
            inlineActions={false}
            compact={true}
          />
        ))
      )}
    </div>
    </>
  )
}