import { useRef } from "react";
import { WeekCalendarProps } from "../types/WeekCalendarProps";

export const WeekCalendarGrid = ({
  weekDates,
  choresByDay,
  setSelectedDate,
  setWeekOffset,
  setViewMode,
}: WeekCalendarProps) => {
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const diff = e.changedTouches[0].clientX - touchStartX.current;

    if (diff > 50) setWeekOffset((p) => p - 1);
    if (diff < -50) setWeekOffset((p) => p + 1);

    touchStartX.current = null;
  };
  const today = new Date().toDateString();

  return (
    <div
      className="week-view"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {Object.entries(weekDates).map(([day, date]) => {
        const isToday = date.toDateString() === today;
        const dayChores = choresByDay[day] ?? [];

        return (
          <div
            key={day}
            className={`week-day ${isToday ? "today" : ""}`}
            onClick={() => {
              setSelectedDate(date);
              setViewMode("day");
            }}
          >
            <div className="week-day-header">
              <div>{day}</div>
              <div>{date.getDate()}</div>
            </div>

            <div
              className="week-chore "
              key={day}
              onClick={() => {
                setSelectedDate(date);
                setViewMode("day");
              }}
            >
              {dayChores.length === 0 ? (
                <div className="empty-day">
                  <p className="empty-dayp">Inga quests denna dag.</p>
                  <p className="empty-dayp">
                    Passa på att hämta från frivillig listan.
                  </p>
                </div>
              ) : (
                dayChores.slice(0, 3).map((chore) => (
                  <div
                    key={chore.id}
                    className={`week-chore-card status-${chore.status?.toLowerCase()}`}
                  >
                    <div>
                      <span className="week-quest-bullet">•</span>
                      {chore.title}
                    </div>
                    <div className="weekview-chore-reward">
                      <p>{chore.rewardValue} </p>
                      <p>{chore.rewardType === "money" ? " kr" : " XP"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
