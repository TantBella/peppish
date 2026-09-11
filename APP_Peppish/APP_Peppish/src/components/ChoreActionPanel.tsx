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
  const canApprove = chore.uiStatus === "Completed" && user?.role === "ADULT";
  const canEditOrDelete = allowAdminActions && user?.role === "ADULT";
  const canPick =
    allowPicking && !chore.assignedToUserId && chore.availableAssignmentId;
  const canSchedule =
    allowPicking && (user?.role === "CHILD" || user?.role === "ADULT");

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
      setError(
        err instanceof Error ? err.message : "Questen kunde inte slutföras",
      );
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
      setError(
        err instanceof Error ? err.message : "Questen kunde inte godkännas",
      );
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
      setError(
        err instanceof Error ? err.message : "Questen kunde inte tilldelas",
      ),
  });

  const takeMutation = useMutation({
    mutationFn: () => choreAssignmentApi.take(chore.availableAssignmentId!),
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      queryClient.invalidateQueries({ queryKey: ["chore-templates"] });
      onSuccess?.();
    },
    onError: (err) =>
      setError(
        err instanceof Error ? err.message : "Questen kunde inte väljas",
      ),
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
      setError(
        err instanceof Error ? err.message : "Questen kunde inte schemaläggas",
      ),
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
            {completeMutation.isPending ? "Slutför..." : "Slutförd"}
          </button>
        )}
        {canApprove && (
          <button
            onClick={() => approveMutation.mutate()}
            disabled={approveMutation.isPending}
            className="btn-approve"
          >
            {approveMutation.isPending ? "Godkänner..." : "Godkänn"}
          </button>
        )}
        {chore.uiStatus === "Approved" && (
          <div className="status-complete">✓ Godkänd och slutförd</div>
        )}
        {!canComplete && !canApprove && chore.uiStatus !== "Approved" && (
          <div className="status-info">
            Väntar på{" "}
            {chore.uiStatus === "Completed" ? "godkännande" : "tilldelning"}
          </div>
        )}
        {allowAdminActions && user?.role === "ADULT" && (
          <div className="assign-section">
            <label>Tilldela till användar-ID:</label>
            <input
              type="text"
              placeholder="Användar-ID"
              onChange={(e) => assignMutation.mutate(e.target.value)}
            />
          </div>
        )}
        {canPick && (
          <div className="pick-section">
            <button
              className="btn-pick"
              onClick={() => takeMutation.mutate()}
              disabled={takeMutation.isPending}
            >
              {takeMutation.isPending ? "Väljer..." : "Välj questen"}
            </button>
            <button
              className="btn-schedule"
              onClick={() => setScheduling(true)}
            >
              Välj datum
            </button>
          </div>
        )}
        {canSchedule && scheduling && (
          <div className="schedule-section">
            <label>Välj datum:</label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
            <button
              onClick={() => scheduleMutation.mutate()}
              disabled={scheduleMutation.isPending || !scheduleDate}
            >
              {scheduleMutation.isPending ? "Schemalägger..." : "Schemalägg"}
            </button>
            <button
              onClick={() => {
                setScheduling(false);
                setScheduleDate("");
              }}
            >
              Avbryt
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
