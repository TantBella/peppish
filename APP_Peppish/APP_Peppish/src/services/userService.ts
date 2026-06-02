import { userServiceLocal } from './userService.local'
import { userServiceApi } from './userService.api'

export const userService = process.env.REACT_APP_API_URL ? userServiceApi : userServiceLocal
