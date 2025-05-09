import { Link } from "react-router-dom"
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi"

function NotAuthorized() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertTriangle className="text-red-600 text-2xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. This area is restricted to administrators only.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <FiArrowLeft size={16} />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  )
}

export default NotAuthorized
