import { ChoreWithUIStatus } from "../hooks/useChores";

interface ChoreCardProps {
  chore: ChoreWithUIStatus;
  currentUserId?: string;
  isExpanded: boolean;
  onToggle: () => void;
  compact?: boolean;
}

export const ChoreCard = ({
  chore,
  isExpanded,
  onToggle,
  compact = false,
}: ChoreCardProps) => {
  const statusLabels = {
    available: "Tillgänglig",
    assigned: "Ej påbörjad",
    completed: "Klar",
    approved: "Godkänd",
  } as const;

  return (
    <div
      className={`chore-card status-${chore.uiStatus.toLowerCase()} ${isExpanded ? "expanded" : ""}`}
      onClick={onToggle}
    >
      <div className="chore-header">
        <h3>{chore.title}</h3>
        <span className="status-badge">{statusLabels[chore.uiStatus]}</span>
      </div>

      {!compact && (
        <div className="chore-meta">
          {chore.dueDate && (
            <div className="due-date">
              {new Date(chore.dueDate).toLocaleDateString()}
            </div>
          )}
          <span className="reward-badge">
            {chore.rewardValue
              ? chore.rewardType === "Money"
                ? `🤑 ${chore.rewardValue} kr`
                : `💎 ${chore.rewardValue} XP`
              : ""}
          </span>

          {chore.assignedToUserName && (
            <div className="assigned-to">{chore.assignedToUserName}</div>
          )}
        </div>
      )}
    </div>
  );
};
