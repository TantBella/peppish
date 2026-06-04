import { authServiceApi } from "./authService.api";

// Use API-backed service when REACT_APP_API_URL is set; otherwise keep local fallback
export const authService = import.meta.env.VITE_API_URL ? authServiceApi : null;
