import { householdServiceLocal } from './householdService.local'

export const householdService = {
  getHouseholds: householdServiceLocal.getHouseholds,
  getHouseholdById: householdServiceLocal.getHouseholdById,
  createHousehold: householdServiceLocal.createHousehold,
}
