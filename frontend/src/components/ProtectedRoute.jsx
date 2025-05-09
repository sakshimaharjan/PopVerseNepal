import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./AuthContext"
import NotAuthorized from "../pages/NotAuthorized"

function ProtectedRoute({ children, adminOnly = false }) {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} />
  }

  // Check if route requires admin access
  if (adminOnly) {
    // Check if path contains /admin or if adminOnly prop is true
    const isAdminRoute = location.pathname.includes("/admin")

    // If user is not an admin and trying to access admin route
    if ((isAdminRoute || adminOnly) && currentUser.role !== "admin") {
      // Instead of redirecting, show the NotAuthorized component
      return <NotAuthorized />
    }
  }

  return children
}

export default ProtectedRoute
