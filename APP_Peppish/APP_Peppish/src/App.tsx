import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'

import { ProtectedRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { ChoreListPage } from './pages/ChoreListPage'
import { CreateChorePage } from './pages/CreateChorePage'
import { CalendarPage} from './pages/CalendarPage'
import { RewardsPage } from './pages/RewardsPage'
import { ProgressPage } from './pages/ProgressPage'

const queryClient = new QueryClient()

function MainLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>

            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes with shared layout */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<HomePage />} />
              
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/chores" element={<ChoreListPage />} />
              <Route path="/chores/new" element={<CreateChorePage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/progress" element={<ProgressPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App