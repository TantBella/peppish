import { userServiceLocal } from './userService.local'

export const userService = {
  getUsers: userServiceLocal.getUsers,
  updateUser: userServiceLocal.updateUser,
  createUser: userServiceLocal.createUser,
}
