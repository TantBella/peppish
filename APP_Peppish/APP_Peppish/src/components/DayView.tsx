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
        <p className="no-chores">Inga quests denna dag</p>
      ) : (
        filtered.map((chore) => (
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
    {/* <div className="single-list">
      {todayChores.length === 0 ? (
        <p className="no-chores"> Inga quests idag</p>
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
      <div className="single-list">
      {filtered.length === 0 ? (
        <p className="no-chores">Inga quests denna dag</p>
      ) : (
        filtered.map((chore) => (
          <ChoreCardWrapper
            key={chore.id}
            chore={chore}
            expandedChoreId={expandedChoreId}
            setExpandedChoreId={setExpandedChoreId}
          />
        ))
      )}
    </div> */}
    </>
  )
}