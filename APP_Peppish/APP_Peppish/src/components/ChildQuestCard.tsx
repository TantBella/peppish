import { ChoreWithUIStatus } from "../hooks/useChores";
import { ChoreCard } from "./ChoreCard";
import { ChoreActionPanel } from "./ChoreActionPanel";

interface ChildQuestCardProps {
  childName?: string;
  title?: string;
  chores: ChoreWithUIStatus[];
  isExpanded: boolean;
  expandedChoreId: string | null;
  onToggle: () => void;
  onToggleChore: (id: string) => void;
}

export const ChildQuestCard = ({
  childName,
  title,
  chores,
  isExpanded,
  expandedChoreId,
  onToggle,
  onToggleChore,
}: ChildQuestCardProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayChores = chores.filter((chore) => {
    const dueDate = new Date(chore.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate.getTime() === today.getTime();
  });

  const notStarted = todayChores.filter(
    (chore) => chore.uiStatus === "assigned",
  );

  const pendingApproval = todayChores.filter(
    (chore) => chore.uiStatus === "completed",
  );

  const approved = todayChores.filter((chore) => chore.uiStatus === "approved");

  const hasPendingApproval = pendingApproval.length > 0;

  return (
    <section className={`child-quest-card ${isExpanded ? "expanded" : ""}`}>
      <button type="button" className="child-quest-header" onClick={onToggle}>
        <div className="child-name">
          <h2>{title ?? `Dagens Quests för ${childName}`}</h2>
        </div>
        <span className="child-quest-chevron">{isExpanded ? "▲" : "▼"}</span>

        {hasPendingApproval && (
          <span
            className="approval-indicator"
            aria-label="Quests väntar på godkännande"
          />
        )}
      </button>

      {isExpanded && (
        <div className="child-quest-content">
          <section>
            <h2 className="child-quest-card-headline">Inte påbörjade:</h2>

            {notStarted.length === 0 ? (
              <p className="empty-child-quests">Inga uppgifter att göra.</p>
            ) : (
              <div className="child-quest-list">
                {notStarted.map((chore) => (
                  <div key={chore.id} className="child-quest-item">
                    <span className="quest-bullet">•</span>

                    <ChoreCard
                      chore={chore}
                      isExpanded={expandedChoreId === chore.id}
                      onToggle={() => onToggleChore(chore.id)}
                      compact
                    />

                    {expandedChoreId === chore.id && (
                      <ChoreActionPanel
                        chore={chore}
                        allowAdminActions={true}
                        allowPicking={false}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="pending-approval-section">
            <h2 className="child-quest-card-headline">
              Väntar på godkännande:
            </h2>

            {pendingApproval.length === 0 ? (
              <p className="empty-child-quests">Inget väntar på godkännande.</p>
            ) : (
              <div className="child-quest-list">
                {pendingApproval.map((chore) => (
                  <div key={chore.id} className="child-quest-item">
                    <span className="quest-bullet">•</span>

                    <ChoreCard
                      chore={chore}
                      isExpanded={expandedChoreId === chore.id}
                      onToggle={() => onToggleChore(chore.id)}
                      compact
                    />

                    {expandedChoreId === chore.id && (
                      <ChoreActionPanel
                        chore={chore}
                        allowAdminActions={false}
                        allowPicking={false}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="child-quest-card-headline">Klara och godkända:</h2>

            {approved.length === 0 ? (
              <p className="empty-child-quests">Inga klara quests ännu.</p>
            ) : (
              <div className="child-quest-list">
                {approved.map((chore) => (
                  <div key={chore.id} className="child-quest-item">
                    <span className="quest-bullet">•</span>

                    <ChoreCard
                      chore={chore}
                      isExpanded={expandedChoreId === chore.id}
                      onToggle={() => onToggleChore(chore.id)}
                      compact
                    />

                    {expandedChoreId === chore.id && (
                      <ChoreActionPanel
                        chore={chore}
                        allowAdminActions={false}
                        allowPicking={false}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
};
