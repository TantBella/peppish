import { userServiceApi } from "./userService.api";

export const userService = import.meta.env.VITE_API_URL ? userServiceApi : null;
