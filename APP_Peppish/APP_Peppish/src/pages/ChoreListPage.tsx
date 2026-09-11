import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useChores, ChoreWithUIStatus } from "../hooks/useChores";
import { ChoreCard } from "../components/ChoreCard";
import { ChoreActionPanel } from "../components/ChoreActionPanel";
import { useAuth } from "../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { choreTemplateService } from "../services/choreTemplateService";
import { NotificationPanel } from "../components/NotificationPanel";
import {
  householdServiceApi,
  HouseholdMember,
} from "../services/householdService.api";
import { ChildQuestCard } from "../components/ChildQuestCard";
import ChoreSkeleton from "../components/ChoreSkeleton";
import logoImg from "../assets/logo_img.png";

export const ChoreListPage = () => {
  const { data: chores = [], isLoading, error } = useChores();
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [children, setChildren] = useState<HouseholdMember[]>([]);
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  const [expandedChoreId, setExpandedChoreId] = useState<string | null>(null);

  useEffect(() => {
    const loadChildren = async () => {
      if (!user?.householdId) return;

      const household = await householdServiceApi.getHouseholdById(
        user.householdId,
      );

      const householdChildren = (household?.users ?? []).filter(
        (member) => member.role === "CHILD",
      );
      setChildren(householdChildren);
    };
    loadChildren();
  }, [user]);

  const { data: templates = [] } = useQuery({
    queryKey: ["chore-templates"],
    queryFn: () => choreTemplateService?.getTemplates(),
  });

  if (isLoading) {
    return (
      <div className="chore-list-page">
        <div className="chore-list-header">
          <h1>Quests</h1>
        </div>
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <ChoreSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <div>Quests kunde inte hämtas</div>
        <button
          className="btn-primary"
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ["chores"],
            })
          }
        >
          Försök igen
        </button>
      </div>
    );
  }

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const toggleChild = (id: string) => {
    setExpandedChildId((prev) => (prev === id ? null : id));
    setExpandedChoreId(null);
  };

  const toggleChildChore = (id: string) => {
    setExpandedChoreId((prev) => (prev === id ? null : id));
  };

  const assignedChores = chores.filter((chore) => chore.assignedToUserId);
  const availableChores = templates;

  const renderChore = (chore: ChoreWithUIStatus, allowPicking = false) => (
    <div key={chore.id} className="chore-item">
      <ChoreCard
        chore={chore}
        currentUserId={user?.id}
        isExpanded={expandedId === chore.id}
        onToggle={() => toggle(chore.id)}
        compact={false}
      />

      {expandedId === chore.id && (
        <div className="chore-expanded">
          <ChoreActionPanel
            chore={chore}
            allowAdminActions={!allowPicking}
            allowPicking={allowPicking}
            onSuccess={() => setExpandedId(null)}
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="header">
        <h1 className="logo-icon">
          <img src={logoImg} alt="App logo" />
          Quests
        </h1>
        <div style={{ position: "absolute", right: 16, top: 16 }}>
          <NotificationPanel />
        </div>
      </header>

      <div className="chore-list-page">
        <div className="chore-list-header">
          <Link to="/chores/new" className="btn-primary btn-small">
            Skapa quest
          </Link>
        </div>

        {children.length === 0 && availableChores.length === 0 ? (
          <div className="empty">
            Inga quests ännu. Lägg till en quest för att komma igång.
          </div>
        ) : (
          <>
            {children.length > 0 && (
              <section>
                <h2>Barn</h2>

                <div className="child-quest-list">
                  {children.map((child) => {
                    const childChores = assignedChores.filter(
                      (chore) => chore.assignedToUserId === child.id,
                    );

                    return (
                      <ChildQuestCard
                        key={child.id}
                        childName={child.name}
                        chores={childChores}
                        isExpanded={expandedChildId === child.id}
                        expandedChoreId={expandedChoreId}
                        onToggle={() => toggleChild(child.id)}
                        onToggleChore={toggleChildChore}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {availableChores.length > 0 && (
              <section>
                  <h2>Lediga quests</h2>
                  <p>Välj en och tjäna extra XP eller pengar 🤗</p>

                <div className="chore-list">
                  {availableChores.map((template: any) =>
                    renderChore(
                      {
                        ...template,
                        id: template.id,
                        dueDate: new Date().toISOString(),
                        status: "Pending",
                        uiStatus: "Pending",
                        rewardAmount: template.rewardValue,
                        availableAssignmentId: template.availableAssignmentId,
                      } as ChoreWithUIStatus,
                      true,
                    ),
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
};
