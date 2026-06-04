import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { choreInstanceApi, choreAssignmentApi } from "../services/choreService";
import { ChoreWithUIStatus } from "../hooks/useChores";
import { useAuth } from "../context/AuthContext";

interface ChoreActionPanelProps {
  chore: ChoreWithUIStatus;
  onSuccess?: () => void;
  allowAdminActions?: boolean;
  allowPicking?: boolean;
}

export const ChoreActionPanel = ({
  chore,
  onSuccess,
  allowAdminActions = true,
  allowPicking = true,
}: ChoreActionPanelProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string>("");

  const canComplete =
    chore.uiStatus === "Pending" && chore.assignedToUserId === user?.id;
  const canApprove = chore.uiStatus === "Completed" && user?.role === "Adult";
  const canEditOrDelete = allowAdminActions && user?.role === "Adult";
  const canPick =
    allowPicking && user?.role === "Child" && !chore.assignedToUserId;
  const canSchedule =
    allowPicking && (user?.role === "Child" || user?.role === "Adult");

  const completeMutation = useMutation({
    mutationFn: () => choreInstanceApi.complete(chore.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["chores"] });
      const previous = queryClient.getQueryData<any[]>(["chores"]);
      queryClient.setQueryData(["chores"], (old: any[] | undefined) =>
        old
          ? old.map((c) =>
              c.id === chore.id ? { ...c, status: "Completed" } : c,
            )
          : old,
      );
      return { previous };
    },
    onSuccess: (updated) => {
      setError(null);
      queryClient.setQueryData(["chore", chore.id], updated);
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      onSuccess?.();
    },
    onError: (err, _vars, context: any) => {
      if (context?.previous)
        queryClient.setQueryData(["chores"], context.previous);
      setError(err instanceof Error ? err.message : "Failed to complete chore");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["chores"] }),
  });

  const approveMutation = useMutation({
    mutationFn: () => choreInstanceApi.approve(chore.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["chores"] });
      const previous = queryClient.getQueryData<any[]>(["chores"]);
      queryClient.setQueryData(["chores"], (old: any[] | undefined) =>
        old
          ? old.map((c) =>
              c.id === chore.id ? { ...c, status: "Approved" } : c,
            )
          : old,
      );
      return { previous };
    },
    onSuccess: (updated) => {
      setError(null);
      queryClient.setQueryData(["chore", chore.id], updated);
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      onSuccess?.();
    },
    onError: (err, _vars, context: any) => {
      if (context?.previous)
        queryClient.setQueryData(["chores"], context.previous);
      setError(err instanceof Error ? err.message : "Failed to approve chore");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["chores"] }),
  });

  const assignMutation = useMutation({
    mutationFn: (assignedToUserId: string) =>
      choreAssignmentApi.assign({
        choreTemplateId: chore.id,
        assignedToUserId,
        startDate: new Date().toISOString(),
      }),
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      onSuccess?.();
    },
    onError: (err) =>
      setError(err instanceof Error ? err.message : "Failed to assign chore"),
  });

  const scheduleMutation = useMutation({
    mutationFn: () =>
      choreAssignmentApi.assign({
        choreTemplateId: chore.id,
        assignedToUserId: user!.id,
        startDate: scheduleDate,
      }),
    onSuccess: () => {
      setError(null);
      setScheduling(false);
      setScheduleDate("");
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      onSuccess?.();
    },
    onError: (err) =>
      setError(err instanceof Error ? err.message : "Failed to schedule chore"),
  });

  return (
    <div className="chore-action-panel">
      {error && <div className="error-message alert alert-error">{error}</div>}
      <div className="action-buttons">
        {canComplete && (
          <button
            onClick={() => completeMutation.mutate()}
            disabled={completeMutation.isPending}
            className="btn-complete"
          >
            {completeMutation.isPending ? "Completing..." : "Complete"}
          </button>
        )}
        {canApprove && (
          <button
            onClick={() => approveMutation.mutate()}
            disabled={approveMutation.isPending}
            className="btn-approve"
          >
            {approveMutation.isPending ? "Approving..." : "Approve"}
          </button>
        )}
        {chore.uiStatus === "Approved" && (
          <div className="status-complete">✓ Approved and Completed</div>
        )}
        {!canComplete && !canApprove && chore.uiStatus !== "Approved" && (
          <div className="status-info">
            Awaiting{" "}
            {chore.uiStatus === "Completed" ? "adult approval" : "assignment"}
          </div>
        )}
        {allowAdminActions && user?.role === "Adult" && (
          <div className="assign-section">
            <label>Assign to user ID:</label>
            <input
              type="text"
              placeholder="User ID"
              onChange={(e) => assignMutation.mutate(e.target.value)}
            />
          </div>
        )}
        {canPick && (
          <div className="pick-section">
            <button
              className="btn-pick"
              onClick={() => assignMutation.mutate(user!.id)}
              disabled={assignMutation.isPending}
            >
              {assignMutation.isPending ? "Picking..." : "Pick this chore"}
            </button>
            <button
              className="btn-schedule"
              onClick={() => setScheduling(true)}
            >
              Pick for a date
            </button>
          </div>
        )}
        {canSchedule && scheduling && (
          <div className="schedule-section">
            <label>Choose date:</label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
            <button
              onClick={() => scheduleMutation.mutate()}
              disabled={scheduleMutation.isPending || !scheduleDate}
            >
              {scheduleMutation.isPending ? "Scheduling..." : "Schedule"}
            </button>
            <button
              onClick={() => {
                setScheduling(false);
                setScheduleDate("");
              }}
            >
              Cancel
            </button>
          </div>
        )}
        {canEditOrDelete && (
          <div className="admin-actions">
            <button
              className="btn-edit"
              onClick={() => navigate(`/chores/${chore.id}/edit`)}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
