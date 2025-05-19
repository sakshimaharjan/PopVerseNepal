import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./AuthContext"
import NotAuthorized from "../pages/NotAuthorized"

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  // While checking auth status, show a loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // If user is not logged in, redirect to login with redirect state
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // If admin access is required
  if (adminOnly) {
    const isAdminRoute = location.pathname.includes("/admin")

    if ((adminOnly || isAdminRoute) && currentUser.role !== "admin") {
      // Show NotAuthorized page instead of redirect
      return <NotAuthorized />
    }
  }

  // If all checks pass, render children
  return children
}

export default ProtectedRoute