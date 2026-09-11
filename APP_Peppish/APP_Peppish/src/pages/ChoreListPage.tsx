import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useChores, ChoreWithUIStatus } from "../hooks/useChores";
import { useAuth } from "../context/AuthContext";
import {
  householdServiceApi,
  HouseholdMember,
} from "../services/householdService.api";
import { NotificationPanel } from "../components/NotificationPanel";
import ChoreSkeleton from "../components/ChoreSkeleton";
import { ChildQuestCard } from "../components/ChildQuestCard";
import { AvailableQuestList } from "../components/AvailableQuestList";
import { ChoreCard } from "../components/ChoreCard";
import { ChoreActionPanel } from "../components/ChoreActionPanel";
import logoImg from "../assets/logo_img.png";

export const ChoreListPage = () => {
  const { data: chores = [], isLoading, error } = useChores();
  const { user } = useAuth();

  const [children, setChildren] = useState<HouseholdMember[]>([]);
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  const [expandedChildChoreId, setExpandedChildChoreId] = useState<
    string | null
  >(null);
  const [expandedOwnChoreId, setExpandedOwnChoreId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadChildren = async () => {
      if (!user?.householdId || user.role !== "ADULT") return;

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

  if (isLoading) {
    return (
      <div className="chore-list-page">
        <ChoreSkeleton />
        <ChoreSkeleton />
        <ChoreSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="chore-list-page">
        <p>Kunde inte hämta quests.</p>
      </div>
    );
  }

  const toggleChild = (id: string) => {
    setExpandedChildId((prev) => (prev === id ? null : id));
    setExpandedChildChoreId(null);
  };

  const toggleChildChore = (id: string) => {
    setExpandedChildChoreId((prev) => (prev === id ? null : id));
  };

  const toggleOwnChore = (id: string) => {
    setExpandedOwnChoreId((prev) => (prev === id ? null : id));
  };

  const assignedChores = chores.filter((chore) => chore.assignedToUserId);

  const ownChores = chores.filter(
    (chore) => chore.assignedToUserId === user?.id,
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
        {user?.role === "ADULT" && (
          <div className="chore-list-header">
            <Link to="/chores/new" className="btn-primary btn-small">
              Skapa quest
            </Link>
          </div>
        )}

        {user?.role === "ADULT" && children.length > 0 && (
          <section>
            <h2>Barnens quests</h2>

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
                    expandedChoreId={expandedChildChoreId}
                    onToggle={() => toggleChild(child.id)}
                    onToggleChore={toggleChildChore}
                  />
                );
              })}
            </div>
          </section>
        )}

        {user?.role === "CHILD" && (
          <section>
            <h2>Dina quests</h2>

            {ownChores.length === 0 ? (
              <p>Du har inga tilldelade quests.</p>
            ) : (
              <div className="chore-list">
                {ownChores.map((chore: ChoreWithUIStatus) => (
                  <div key={chore.id} className="chore-item">
                    <ChoreCard
                      chore={chore}
                      currentUserId={user?.id}
                      isExpanded={expandedOwnChoreId === chore.id}
                      onToggle={() => toggleOwnChore(chore.id)}
                    />

                    {expandedOwnChoreId === chore.id && (
                      <div className="chore-expanded">
                        <ChoreActionPanel
                          chore={chore}
                          allowAdminActions={false}
                          allowPicking={true}
                          onSuccess={() => setExpandedOwnChoreId(null)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <AvailableQuestList />
      </div>
    </>
  );
};
