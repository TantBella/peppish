import { ChoreWithUIStatus } from "../hooks/useChores";
import { ViewMode } from "../hooks/useChoreCalendar";

export type WeekDates = Record<string, Date>;

export type WeekCalendarProps = {
  weekDates: WeekDates;
  choresByDay: Record<string, ChoreWithUIStatus[]>;

  // expandedChoreId: string | null;
  // setExpandedChoreId: (id: string | null) => void;

  setSelectedDate: (date: Date) => void;

  weekOffset: number;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  setViewMode: (mode: ViewMode) => void;
};
