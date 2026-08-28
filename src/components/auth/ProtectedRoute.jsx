import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-8 h-8 border-3 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-600">Verifying campus session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
