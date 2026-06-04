export type Role = "Adult" | "Child";

export type ChoreStatus = "Pending" | "Completed" | "Approved";

export interface User {
  id: string;
  name?: string;
  email?: string;
  role: Role;
  householdId?: string;
}

export interface Chore {
  id: string;
  title: string;
  dueDate: string;
  status: ChoreStatus;
  assignedToUserId?: string;
  assignedToUserName?: string;
  rewardAmount?: number;
}

export interface ChoreTemplate {
  id: string;
  title: string;
  description?: string;
  rewardAmount?: number;
  rewardPoints?: number;
  recurrence?: string;
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

export type UIChoreStatus = "Pending" | "Completed" | "Approved";

export const mapApiStatusToUI = (status: ChoreStatus): UIChoreStatus => status;

export const canTransition = (_from: ChoreStatus, _to: ChoreStatus): boolean =>
  true;
