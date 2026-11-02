import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  choreInstanceApi,
  choreAssignmentApi,
  choreTemplateApi,
} from "../services/choreService";
import { ChoreWithUIStatus } from "../hooks/useChores";
import { useAuth } from "../context/AuthContext";
import { HouseholdMember } from "../services/householdService.api";
import checkIcon from "../assets/icons/check_icon.png";

interface ChoreActionPanelProps {
  chore: ChoreWithUIStatus;
  onSuccess?: () => void;
  allowAdminActions?: boolean;
  allowPicking?: boolean;
  householdMembers?: HouseholdMember[];
  choreTemplateId?: string;
}

export const ChoreActionPanel = ({
  chore,
  onSuccess,
  allowAdminActions = true,
  allowPicking = true,
  householdMembers = [],
  choreTemplateId,
}: ChoreActionPanelProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [showMembers, setShowMembers] = useState(false);

  const isAssignedToCurrentUser =
    chore.assignedToUserId?.toLowerCase() === user?.id?.toLowerCase();
  const canComplete = isAssignedToCurrentUser && chore.uiStatus === "assigned";
  const showCompletionCheckbox =
    isAssignedToCurrentUser && chore.uiStatus !== "available";
  const canApprove = chore.uiStatus === "completed" && user?.role === "ADULT";
  const canEditOrDelete = allowAdminActions && user?.role === "ADULT";
  const templateId = chore.choreTemplateId ?? choreTemplateId;
  const canPick =
    allowPicking &&
    user?.role === "CHILD" &&
    chore.uiStatus === "available" &&
    !chore.assignedToUserId &&
    chore.availableAssignmentId;
  const canAssign =
    allowPicking &&
    user?.role === "ADULT" &&
    chore.uiStatus === "available" &&
    !chore.assignedToUserId &&
    chore.availableAssignmentId;
  const canSchedule = allowPicking && canAssign;

  const completeMutation = useMutation({
    mutationFn: () => choreInstanceApi.complete(chore.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["chores"] });

      const previous = queryClient.getQueriesData({
        queryKey: ["chores"],
      });

      queryClient.setQueriesData(
        { queryKey: ["chores"] },
        (old: ChoreWithUIStatus[] | undefined) =>
          old?.map((c) =>
            c.id === chore.id
              ? {
                  ...c,
                  status: "completed",
                  uiStatus: "completed",
                }
              : c,
          ),
      );

      return { previous };
    },

    onSuccess: () => {
      setError(null);
      onSuccess?.();
    },

    onError: (err, _vars, context) => {
      context?.previous?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      setError(
        err instanceof Error ? err.message : "Questen kunde inte slutföras",
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chores"] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: () => choreInstanceApi.approve(chore.id),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["chores"] });

      const previous = queryClient.getQueriesData({
        queryKey: ["chores"],
      });

      queryClient.setQueriesData(
        { queryKey: ["chores"] },
        (old: ChoreWithUIStatus[] | undefined) =>
          old?.map((c) =>
            c.id === chore.id
              ? {
                  ...c,
                  status: "approved",
                  uiStatus: "approved",
                }
              : c,
          ),
      );

      return { previous };
    },

    onSuccess: () => {
      setError(null);
      onSuccess?.();
    },

    onError: (err, _vars, context) => {
      context?.previous?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      setError(
        err instanceof Error ? err.message : "Questen kunde inte godkännas",
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["chores"] });
    },
  });

  const assignMutation = useMutation({
    mutationFn: (assignedToUserId: string) =>
      choreAssignmentApi.assign({
        choreTemplateId: choreTemplateId!,
        assignedToUserId,
        startDate: scheduleDate || undefined,
      }),
    onSuccess: () => {
      setError(null);
      setShowMembers(false);
      setScheduling(false);
      setScheduleDate("");
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      queryClient.invalidateQueries({
        queryKey: ["available-chore-assignments"],
      });
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

  const deleteMutation = useMutation({
    mutationFn: () => choreTemplateApi.delete(templateId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chores"] });
      queryClient.invalidateQueries({ queryKey: ["chore-templates"] });
      queryClient.invalidateQueries({
        queryKey: ["available-chore-assignments"],
      });
      onSuccess?.();
    },
    onError: (err) =>
      setError(
        err instanceof Error ? err.message : "Questen kunde inte raderas",
      ),
  });

  return (
    <div className="chore-action-panel">
      {error && <div className="error-message alert alert-error">{error}</div>}
      <div className="action-buttons">
        {showCompletionCheckbox && chore.uiStatus !== "approved" && (
          <label className="complete-toggle">
            <input
              type="checkbox"
              checked={
                completeMutation.isPending || chore.uiStatus === "completed"
              }
              onChange={() => completeMutation.mutate()}
              disabled={!canComplete || completeMutation.isPending}
              aria-label="Markera questen som klar"
            />
            <span>
              {chore.uiStatus === "assigned" &&
                !completeMutation.isPending &&
                "Markera som klar"}
              {!canComplete &&
                !canApprove &&
                chore.uiStatus === "completed" &&
                "Väntar på godkännande..."}
            </span>
          </label>
        )}

        {chore.uiStatus === "approved" && (
          <div className="status-info">
            {" "}
            <img src={checkIcon} alt="green checkmark icon" className="checkmark-icon" />
            Godkänd och slutförd
          </div>
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

        {canAssign && (
          <div className="assign-section">
            <button
              className="btn-assign"
              onClick={() => setShowMembers((prev) => !prev)}
            >
              Tilldela
            </button>
            <button
              className="btn-schedule"
              onClick={() => setScheduling((prev) => !prev)}
            >
              Välj datum
            </button>

            {showMembers && (
              <div className="member-list">
                <p>Välj vem som ska få questen:</p>

                {householdMembers.map((member) => (
                  <button
                    key={member.id}
                    className="member-option"
                    onClick={() => assignMutation.mutate(member.id)}
                    disabled={assignMutation.isPending}
                  >
                    {member.name}
                  </button>
                ))}
              </div>
            )}
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
              onClick={() => {
                setScheduling(false);
              }}
            >
              Klar
            </button>
          </div>
        )}
        {canEditOrDelete && (
          <div className="admin-actions">
            <button
              className="btn-edit"
              onClick={() => navigate(`/chores/${templateId}/edit`)}
            >
              Edit
            </button>
            <button
              className="btn-delete"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending || !templateId}
            >
              {deleteMutation.isPending ? "Raderar..." : "Radera"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
