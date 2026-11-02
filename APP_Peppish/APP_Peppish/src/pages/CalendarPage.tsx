import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useChores } from "../hooks/useChores";
import { WeekCalendarGrid } from "../components/WeekCalenderGrid";
import { CalendarTabs } from "../components/CalendarTabs";
import { DayView } from "../components/DayView";
import { MonthView } from "../components/MonthView";
import Modal from "../components/Modal";
import { ChoreActionPanel } from "../components/ChoreActionPanel";
import { ChoreCard } from "../components/ChoreCard";
import Loading from "../components/Loading";
import { useQueryClient } from "@tanstack/react-query";
import HeaderComponent from "../components/HeaderComponent";
import { useChoreCalendar, ViewMode } from "../hooks/useChoreCalendar";

export const CalendarPage = () => {
  const { user } = useAuth();
  const { data: chores = [], isLoading, error } = useChores();

  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [expandedChoreId, setExpandedChoreId] = useState<string | null>(null);

  const { weekDates, monthChores, choresByWeekDay, choresBySelectedDate } =
    useChoreCalendar(chores, weekOffset);

  const activeDate = selectedDate ?? new Date();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedDate) {
      setViewMode("day");
    }
  }, [selectedDate]);

  if (isLoading) return <Loading message="Laddar..." />;
  if (error)
    return (
      <div className="error-message">
        <div>Failed to load calendar</div>
        <button
          className="btn-primary"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["chores"] })
          }
        >
          Retry
        </button>
      </div>
    );

  const expandedChore = chores.find((c) => c.id === expandedChoreId) || null;

  const headerTitle =
    viewMode === "week"
      ? "Veckans quests"
      : viewMode === "month"
        ? "Månadens quests"
        : "Dagens quests";

  return (
    <>
      <HeaderComponent title={headerTitle} />
      <div className="calendar-list-container">
        <CalendarTabs
          viewMode={viewMode}
          selectedDate={selectedDate}
          setViewMode={setViewMode}
          weekOffset={0}
          setSelectedDate={setSelectedDate}
        />

        {viewMode === "day" && (
          <DayView
            chores={choresBySelectedDate(activeDate)}
            userId={user?.id}
            selectedDate={activeDate}
            expandedChoreId={expandedChoreId}
            setExpandedChoreId={setExpandedChoreId}
          />
        )}

        {viewMode === "week" && (
          <WeekCalendarGrid
            weekDates={weekDates}
            choresByDay={choresByWeekDay}
            setSelectedDate={setSelectedDate}
            weekOffset={weekOffset}
            setWeekOffset={setWeekOffset}
            setViewMode={setViewMode}
          />
        )}

        {viewMode === "month" && (
          <MonthView
            chores={monthChores}
            setSelectedDate={setSelectedDate}
            setViewMode={setViewMode}
            setWeekOffset={setWeekOffset}
            userId={user?.id}
            expandedChoreId={expandedChoreId}
            setExpandedChoreId={setExpandedChoreId}
          />
        )}

        {expandedChore && (
          <Modal onClose={() => setExpandedChoreId(null)} full>
            <div className="modal-chore-full">
              <ChoreCard
                chore={expandedChore}
                currentUserId={user?.id}
                isExpanded={true}
                onToggle={() => {}}
              />
              <ChoreActionPanel
                chore={expandedChore}
                onSuccess={() => setExpandedChoreId(null)}
                allowAdminActions={false}
                allowPicking={true}
              />
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};
