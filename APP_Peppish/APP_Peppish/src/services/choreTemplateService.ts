import { choreTemplateServiceApi } from "./choreTemplateService.api";

export const choreTemplateService = import.meta.env.VITE_API_URL
  ? choreTemplateServiceApi
  : null;
