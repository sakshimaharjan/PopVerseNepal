import { useState, useRef } from "react"
import { useAuth } from "../components/AuthContext"
import { FiUser, FiMail, FiLock, FiUpload, FiCamera, FiCheck, FiX, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"

function ProfilePage() {
  const { currentUser, updateProfile, changePassword, uploadProfilePicture } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Password visibility state
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  // UI state
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    picture: false,
  })
  const [success, setSuccess] = useState({
    profile: false,
    password: false,
    picture: false,
  })
  const [error, setError] = useState({
    profile: null,
    password: null,
    picture: null,
  })
  const [previewImage, setPreviewImage] = useState(null)

  // Default profile picture if none exists
  const defaultProfilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    currentUser?.name || "User",
  )}&background=6366F1&color=fff`

  // Use profile picture if available, otherwise use default
  const profilePicture = currentUser?.profilePicture || defaultProfilePic

  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle password form change
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading((prev) => ({ ...prev, profile: true }))
    setError((prev) => ({ ...prev, profile: null }))
    setSuccess((prev) => ({ ...prev, profile: false }))

    try {
      await updateProfile(profileForm)
      setSuccess((prev) => ({ ...prev, profile: true }))

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess((prev) => ({ ...prev, profile: false }))
      }, 3000)
    } catch (err) {
      setError((prev) => ({
        ...prev,
        profile: err.response?.data?.message || "Failed to update profile",
      }))
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }))
    }
  }

  // Handle password change
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError((prev) => ({
        ...prev,
        password: "New passwords do not match",
      }))
      return
    }

    setLoading((prev) => ({ ...prev, password: true }))
    setError((prev) => ({ ...prev, password: null }))
    setSuccess((prev) => ({ ...prev, password: false }))

    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setSuccess((prev) => ({ ...prev, password: true }))

      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess((prev) => ({ ...prev, password: false }))
      }, 3000)
    } catch (err) {
      setError((prev) => ({
        ...prev,
        password: err.response?.data?.message || "Failed to change password",
      }))
    } finally {
      setLoading((prev) => ({ ...prev, password: false }))
    }
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Preview image
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Handle profile picture upload
  const handlePictureUpload = async () => {
    if (!fileInputRef.current.files[0]) return

    setLoading((prev) => ({ ...prev, picture: true }))
    setError((prev) => ({ ...prev, picture: null }))
    setSuccess((prev) => ({ ...prev, picture: false }))

    try {
      const formData = new FormData()
      formData.append("image", fileInputRef.current.files[0])

      await uploadProfilePicture(formData)
      setSuccess((prev) => ({ ...prev, picture: true }))
      setPreviewImage(null)

      // Reset file input
      fileInputRef.current.value = ""

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess((prev) => ({ ...prev, picture: false }))
      }, 3000)
    } catch (err) {
      setError((prev) => ({
        ...prev,
        picture: err.response?.data?.message || "Failed to upload profile picture",
      }))
    } finally {
      setLoading((prev) => ({ ...prev, picture: false }))
    }
  }

  // Cancel image preview
  const cancelImagePreview = () => {
    setPreviewImage(null)
    fileInputRef.current.value = ""
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <FiArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-indigo-600 text-white">
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-indigo-100">Update your personal information and account settings</p>
          </div>

          {/* Profile Picture Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={previewImage || profilePicture}
                  alt={currentUser?.name || "User"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                />
                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                  <FiCamera size={18} />
                </label>
                <input
                  type="file"
                  id="profile-picture"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="flex-1">
                {previewImage ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">Ready to upload your new profile picture?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePictureUpload}
                        disabled={loading.picture}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {loading.picture ? (
                          <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <FiUpload size={16} />
                        )}
                        <span>Upload</span>
                      </button>
                      <button
                        onClick={cancelImagePreview}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">Upload a new profile picture</p>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="px-4 py-2 border cursor-pointer border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <FiUpload size={16} />
                      <span>Choose Image</span>
                    </button>
                  </div>
                )}

                {error.picture && (
                  <div className="mt-2 text-red-600 text-sm flex items-center gap-1">
                    <FiX size={14} />
                    <span>{error.picture}</span>
                  </div>
                )}

                {success.picture && (
                  <div className="mt-2 text-green-600 text-sm flex items-center gap-1">
                    <FiCheck size={14} />
                    <span>Profile picture updated successfully!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {error.profile && (
                  <div className="text-red-600 text-sm flex items-center gap-1">
                    <FiX size={14} />
                    <span>{error.profile}</span>
                  </div>
                )}

                {success.profile && (
                  <div className="text-green-600 text-sm flex items-center gap-1">
                    <FiCheck size={14} />
                    <span>Profile updated successfully!</span>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading.profile}
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600  cursor-pointer text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading.profile ? (
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <FiCheck size={16} />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
            <form onSubmit={handlePasswordUpdate}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.currentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="pl-10 pr-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("currentPassword")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPasswords.currentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      className="pl-10 pr-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPasswords.newPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className="pl-10 pr-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPasswords.confirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {error.password && (
                  <div className="text-red-600 text-sm flex items-center gap-1">
                    <FiX size={14} />
                    <span>{error.password}</span>
                  </div>
                )}

                {success.password && (
                  <div className="text-green-600 text-sm flex items-center gap-1">
                    <FiCheck size={14} />
                    <span>Password changed successfully!</span>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading.password}
                    className="w-full sm:w-auto px-4 cursor-pointer py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading.password ? (
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <FiCheck size={16} />
                    )}
                    <span>Change Password</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
