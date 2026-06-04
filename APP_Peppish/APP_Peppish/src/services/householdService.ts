import { householdServiceApi } from "./householdService.api";

export const householdService = import.meta.env.VITE_API_URL
  ? householdServiceApi
  : null;
