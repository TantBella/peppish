export type Role = "ADULT" | "CHILD";

export type ChoreStatus = "available" | "assigned" | "completed" | "approved";

export interface User {
  id: string;
  name?: string;
  email?: string;
  role: Role;
  householdId?: string;
}

export interface Chore {
  id: string;
  choreTemplateId?: string;
  title: string;
  dueDate: string;
  status: ChoreStatus;
  assignedToUserId?: string;
  assignedToUserName?: string;
  rewardValue?: number;
  rewardAmount?: number;
  availableAssignmentId?: string;
  isAvailable?: boolean;
}

export interface ChoreTemplate {
  id: string;
  title: string;
  description?: string;
  rewardValue: number;
  rewardType: string;
  recurrence: string;
}

export interface ChoreAssignment {
  id: string;
  choreTemplateId: string;
  assignedToUserId: string;
  assignedToUserName?: string;
  startDate: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

export type UIChoreStatus = ChoreStatus;

export const mapApiStatusToUI = (status: ChoreStatus): UIChoreStatus => status;

export const canTransition = (
  from: ChoreStatus,
  to: ChoreStatus,
): boolean => {
  const transitions: Record<ChoreStatus, ChoreStatus[]> = {
    available: ["assigned"],
    assigned: ["completed", "available"],
    completed: ["approved"],
    approved: [],
  };

  return transitions[from]?.includes(to) ?? false;
};
