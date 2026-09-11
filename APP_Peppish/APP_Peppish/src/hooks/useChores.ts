import { useQuery } from "@tanstack/react-query";
import { choreInstanceApi } from "../services/choreService";
import { Chore, ChoreStatus, UIChoreStatus } from "../types";

const mapChoreStatusToUI = (chore: Chore): UIChoreStatus => {
  const normalizedStatus = chore.status.toLowerCase();

  if (normalizedStatus === "pending") {
    return chore.assignedToUserId ? "assigned" : "available";
  }

  const status = normalizedStatus as ChoreStatus;

  return status === "available" && chore.assignedToUserId ? "assigned" : status;
};

export interface ChoreWithUIStatus extends Chore {
  uiStatus: UIChoreStatus;
}

export const useChores = (params?: { from?: string; to?: string }) => {
  return useQuery({
    queryKey: ["chores", params],
    queryFn: async () => {
      const chores = await choreInstanceApi.getAll(params);
      return chores.map((chore: Chore) => ({
        ...chore,
        uiStatus: mapChoreStatusToUI(chore),
      })) as ChoreWithUIStatus[];
    },
  });
};

export const useChore = (id: string) => {
  return useQuery({
    queryKey: ["chore", id],
    queryFn: async () => {
      const chores = await choreInstanceApi.getAll();
      const chore = chores.find((c: Chore) => c.id === id);
      if (!chore) throw new Error("Questen hittas inte");
      return {
        ...chore,
        uiStatus: mapChoreStatusToUI(chore),
      } as ChoreWithUIStatus;
    },
    enabled: !!id,
  });
};
