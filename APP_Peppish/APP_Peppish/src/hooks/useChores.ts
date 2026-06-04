import { useQuery } from "@tanstack/react-query";
import { choreInstanceApi } from "../services/choreService";
import { Chore, ChoreStatus, UIChoreStatus } from "../types";

const mapChoreStatusToUI = (status: ChoreStatus): UIChoreStatus => {
  if (status === "Pending") return "Pending";
  if (status === "Completed") return "Completed";
  return "Approved";
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
        uiStatus: mapChoreStatusToUI(chore.status),
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
      if (!chore) throw new Error("Chore not found");
      return { ...chore, uiStatus: mapChoreStatusToUI(chore.status) } as ChoreWithUIStatus;
    },
    enabled: !!id,
  });
};
