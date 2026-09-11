import { ChoreWithUIStatus } from "../hooks/useChores";
import { ChoreCard } from "./ChoreCard";
import { ChoreActionPanel } from "./ChoreActionPanel";

interface ChildQuestCardProps {
  childName: string;
  chores: ChoreWithUIStatus[];
  isExpanded: boolean;
  expandedChoreId: string | null;
  onToggle: () => void;
  onToggleChore: (id: string) => void;
}

export const ChildQuestCard = ({
  childName,
  chores,
  isExpanded,
  expandedChoreId,
  onToggle,
  onToggleChore,
}: ChildQuestCardProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayChores = chores
    .filter((chore) => {
      const dueDate = new Date(chore.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      return dueDate.getTime() === today.getTime();
    })
    .slice(0, 5);

  const pendingApproval = chores.filter((chore) => {
    const dueDate = new Date(chore.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return (
      chore.uiStatus === "Completed" && dueDate.getTime() < today.getTime()
    );
  });

  const todayCompleted = todayChores.filter(
    (chore) => chore.uiStatus === "Completed",
  );

  const hasPendingApproval =
    todayCompleted.length > 0 || pendingApproval.length > 0;

  return (
    <section className={`child-quest-card ${isExpanded ? "expanded" : ""}`}>
      <button type="button" className="child-quest-header" onClick={onToggle}>
        <span className="child-name">{childName}</span>

        {hasPendingApproval && (
          <span
            className="approval-indicator"
            aria-label="Quests väntar på godkännande"
          />
        )}

        <span className="child-quest-chevron">{isExpanded ? "▲" : "▼"}</span>
      </button>

      {isExpanded && (
        <div className="child-quest-content">
          <h3>Idag</h3>

          {todayChores.length === 0 ? (
            <p className="empty-child-quests">Inga quests idag.</p>
          ) : (
            <div className="child-quest-list">
              {todayChores.map((chore) => (
                <div key={chore.id} className="child-quest-item">
                  <ChoreCard
                    chore={chore}
                    isExpanded={expandedChoreId === chore.id}
                    onToggle={() => onToggleChore(chore.id)}
                    compact
                  />

                  {expandedChoreId === chore.id && (
                    <ChoreActionPanel
                      chore={chore}
                      allowAdminActions
                      allowPicking={false}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {pendingApproval.length > 0 && (
            <section className="pending-approval-section">
              <h3>Behöver godkännas</h3>

              <div className="child-quest-list">
                {pendingApproval.map((chore) => (
                  <div key={chore.id} className="child-quest-item">
                    <ChoreCard
                      chore={chore}
                      isExpanded={expandedChoreId === chore.id}
                      onToggle={() => onToggleChore(chore.id)}
                      compact
                    />

                    {expandedChoreId === chore.id && (
                      <ChoreActionPanel
                        chore={chore}
                        allowAdminActions
                        allowPicking={false}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  );
};
