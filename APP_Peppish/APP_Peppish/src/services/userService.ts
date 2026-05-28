import { userServiceLocal } from './userService.local'

export const userService = {
  getUsers: userServiceLocal.getUsers,
}
