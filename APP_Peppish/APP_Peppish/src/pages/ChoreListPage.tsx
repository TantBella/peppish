import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useChores } from "../hooks/useChores";
import { useAuth } from "../context/AuthContext";
import {
  householdServiceApi,
  HouseholdMember,
} from "../services/householdService.api";
import { NotificationPanel } from "../components/NotificationPanel";
import ChoreSkeleton from "../components/ChoreSkeleton";
import { ChildQuestCard } from "../components/ChildQuestCard";
import { AvailableQuestList } from "../components/AvailableQuestList";
import logoImg from "../assets/logo_img.png";

export const ChoreListPage = () => {
  const { data: chores = [], isLoading, error } = useChores();
  const { user } = useAuth();

  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>(
    [],
  );
  const [children, setChildren] = useState<HouseholdMember[]>([]);
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  const [expandedChildChoreId, setExpandedChildChoreId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadChildren = async () => {
      if (!user?.householdId || user.role !== "ADULT") return;

      const household = await householdServiceApi.getHouseholdById(
        user.householdId,
      );
      const members = household?.users ?? [];
      setHouseholdMembers(members);
      const householdChildren = members.filter(
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

  const assignedChores = chores.filter((chore) => chore.assignedToUserId);

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
        <AvailableQuestList householdMembers={householdMembers} />
      </div>
    </>
  );
};
