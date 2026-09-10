import { choreAssignmentServiceApi } from "./choreAssignmentService.api";

export const choreAssignmentService = import.meta.env.VITE_API_URL
  ? choreAssignmentServiceApi
  : null;
