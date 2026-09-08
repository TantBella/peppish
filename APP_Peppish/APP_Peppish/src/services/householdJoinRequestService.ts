import { householdJoinRequestServiceApi } from "./householdJoinRequestService.api";

export const householdJoinRequestService = import.meta.env.VITE_API_URL
  ? householdJoinRequestServiceApi
  : null;
