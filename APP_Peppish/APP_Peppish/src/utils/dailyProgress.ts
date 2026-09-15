import { ChoreWithUIStatus } from "../hooks/useChores";

export const getTodaysChores = (
  chores: ChoreWithUIStatus[],
): ChoreWithUIStatus[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return chores.filter((chore) => {
    const dueDate = new Date(chore.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  });
};

export const getDailyProgressPercent = (
  chores: ChoreWithUIStatus[],
): number => {
  const todaysChores = getTodaysChores(chores);

  if (todaysChores.length === 0) return 0;

  const completedChores = todaysChores.filter(
    (chore) => chore.uiStatus === "approved",
  ).length;

  return Math.round((completedChores / todaysChores.length) * 100);
};
