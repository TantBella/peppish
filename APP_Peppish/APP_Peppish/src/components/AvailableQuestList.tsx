import { useQuery } from "@tanstack/react-query";
import { choreTemplateService } from "../services/choreTemplateService";
import { choreAssignmentApi } from "../services/choreService";
import { ChoreWithUIStatus } from "../hooks/useChores";
import { ChoreCard } from "./ChoreCard";
import { ChoreActionPanel } from "./ChoreActionPanel";
import { useState } from "react";
import { HouseholdMember } from "../services/householdService.api";

interface AvailableQuestListProps {
  householdMembers: HouseholdMember[];
}

interface AvailableChore extends ChoreWithUIStatus {
  choreTemplateId: string;
}

export const AvailableQuestList = ({
  householdMembers,
}: AvailableQuestListProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: templates = [] } = useQuery({
    queryKey: ["chore-templates"],
    queryFn: () => choreTemplateService?.getTemplates(),
  });

  const { data: availableAssignments = [] } = useQuery({
    queryKey: ["available-chore-assignments"],
    queryFn: () => choreAssignmentApi.getAvailable(),
  });

  const availableChores = availableAssignments
    .map((assignment: any) => {
      const template = templates.find(
        (template: any) => template.id === assignment.choreTemplateId,
      );

      if (!template) return null;

      return {
        ...template,
        id: assignment.id,
        choreTemplateId: template.id,
        dueDate: assignment.dueDate ?? new Date().toISOString(),
        status: "available",
        uiStatus: "available",
        rewardAmount: template.rewardValue,
        availableAssignmentId: assignment.id,
        assignedToUserId: undefined,
        assignedToUserName: undefined,
      } as AvailableChore;
    })
    .filter(Boolean) as AvailableChore[];

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (availableChores.length === 0) {
    return null;
  }

  return (
    <section>
      <h2>Lediga quests</h2>
      <p>Välj en och tjäna extra XP eller pengar 🤗</p>
      <div className="chore-list">
        {availableChores.map((chore) => (
          <div key={chore.id} className="chore-item">
            <ChoreCard
              chore={chore}
              isExpanded={expandedId === chore.id}
              onToggle={() => toggle(chore.id)}
              compact={false}
            />

            {expandedId === chore.id && (
              <div className="chore-expanded">
                <ChoreActionPanel
                  chore={chore}
                  choreTemplateId={chore.choreTemplateId}
                  allowAdminActions={false}
                  allowPicking
                  householdMembers={householdMembers}
                  onSuccess={() => setExpandedId(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
