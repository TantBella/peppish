import { ChoreWithUIStatus } from "../hooks/useChores";

export const getTodaysChores = (
  chores: ChoreWithUIStatus[],
  userId?: string,
): ChoreWithUIStatus[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return chores.filter((chore) => {
    const dueDate = new Date(chore.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return (
      dueDate.getTime() === today.getTime() && chore.assignedToUserId === userId
    );
  });
};

export const getDailyProgressPercent = (
  chores: ChoreWithUIStatus[],
  userId?: string,
): number => {
  const todaysChores = getTodaysChores(chores, userId);

  if (todaysChores.length === 0) return 0;

  const completedChores = todaysChores.filter(
    (chore) => chore.uiStatus === "approved",
  ).length;

  return Math.round((completedChores / todaysChores.length) * 100);
};
