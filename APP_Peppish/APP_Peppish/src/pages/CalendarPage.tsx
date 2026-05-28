import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useChores } from "../hooks/useChores";

import logoImg from "../assets/logo_img.png";
import { WeekCalendarGrid } from "../components/WeekCalenderGrid";
import { CalendarTabs } from "../components/CalendarTabs";
import { DayView } from "../components/DayView";
import { MonthView } from "../components/MonthView";
import Modal from '../components/Modal'
import { ChoreActionPanel } from '../components/ChoreActionPanel'
import { ChoreCard } from '../components/ChoreCard'

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

  useEffect(() => {
    if (selectedDate) {
      setViewMode("day");
    }
  }, [selectedDate]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed</div>;

  const expandedChore = chores.find((c) => c.id === expandedChoreId) || null

  return (
    <div className="calendar-list-container">
      <h1 className="logo-icon">
        <img src={logoImg} alt="App logo" />
        Dina quests
      </h1>

      <CalendarTabs
        viewMode={viewMode}
        selectedDate={selectedDate}
        setViewMode={setViewMode}
        weekOffset={0}
        setSelectedDate={setSelectedDate}
      />

      {viewMode === "week" && (
        <WeekCalendarGrid
          weekDates={weekDates}
          choresByDay={choresByWeekDay}
          expandedChoreId={expandedChoreId}
          setExpandedChoreId={setExpandedChoreId}
          setSelectedDate={setSelectedDate}
          weekOffset={weekOffset}
          setWeekOffset={setWeekOffset}
        />
      )}

      {viewMode === "day" && (
        <DayView
          chores={choresBySelectedDate(activeDate)}
          userId={user?.id}
          selectedDate={activeDate}
          expandedChoreId={expandedChoreId}
          setExpandedChoreId={setExpandedChoreId}
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

      {/* Modal for calendar views when a chore is selected */}
      {expandedChore && (
        <Modal onClose={() => setExpandedChoreId(null)} full>
          <div className="modal-chore-full">
            <ChoreCard chore={expandedChore} currentUserId={user?.id} isExpanded={true} onToggle={() => {}} />
            <ChoreActionPanel chore={expandedChore} onSuccess={() => setExpandedChoreId(null)} allowAdminActions={false} allowPicking={true} />
          </div>
        </Modal>
      )}

    </div>
  );
};
