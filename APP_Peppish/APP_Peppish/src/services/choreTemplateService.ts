import { choreTemplateServiceApi } from './choreTemplateService.api'
import { choreTemplateServiceLocal } from './choreTemplateService.local'

export const choreTemplateService = import.meta.env.VITE_API_URL ? choreTemplateServiceApi : choreTemplateServiceLocal
