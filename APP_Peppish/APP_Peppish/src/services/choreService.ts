import { choreServiceApi } from "./choreService.api";
export {
  choreTemplateApi,
  choreAssignmentApi,
  choreInstanceApi,
} from "./choreService.api";

export const choreService = import.meta.env.VITE_API_URL
  ? choreServiceApi
  : null;
