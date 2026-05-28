import { useEffect, useState } from 'react'
import { householdService } from '../services/householdService'
import { userService } from '../services/userService'
import { useAuth } from '../context/AuthContext'

export const HouseholdManagementPage = () => {
  const { user } = useAuth()
  const [households, setHouseholds] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [name, setName] = useState('')
  const [selectedHousehold, setSelectedHousehold] = useState('')

  useEffect(() => {
    householdService.getHouseholds().then((h) => setHouseholds(h))
    userService.getUsers().then((u) => setUsers(u))
  }, [])

  const createHousehold = async () => {
    if (!name.trim()) return
    const h = await householdService.createHousehold(name.trim())
    setHouseholds((p) => [h, ...p])
    setName('')
  }

  const assignUser = async (userId: string) => {
    if (!selectedHousehold) return
    await userService.updateUser(userId, { householdId: selectedHousehold })
    const u = await userService.getUsers()
    setUsers(u)
  }

  if (!user) return <div>Please login</div>

  return (
    <div className="household-page">
      <h1>Household Management</h1>

      <section className="create-household">
        <h2>Create household</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Household name" />
        <button onClick={createHousehold}>Create</button>
      </section>

      <section className="household-list">
        <h2>Households</h2>
        <ul>
          {households.map((h) => (
            <li key={h.id}>{h.name} ({h.id})</li>
          ))}
        </ul>
      </section>

      <section className="assign-users">
        <h2>Assign user to household</h2>
        <select value={selectedHousehold} onChange={(e) => setSelectedHousehold(e.target.value)}>
          <option value="">Select household</option>
          {households.map((h) => (<option key={h.id} value={h.id}>{h.name}</option>))}
        </select>

        <div className="users-list">
          {users.map((u) => (
            <div key={u.id} className="user-row">
              <span>{u.name || u.email} - {u.householdId || 'No household'}</span>
              <button onClick={() => assignUser(u.id)}>Assign</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
