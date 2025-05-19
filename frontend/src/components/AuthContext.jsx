"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          // Set auth header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

          // Get user data
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`)
          setCurrentUser(response.data)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // If token is invalid, remove it
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      setError(null)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      })

      // Check if response has the expected structure
      if (!response.data || !response.data.token) {
        throw new Error("Invalid response from server")
      }

      const { token } = response.data

      // Save token to localStorage
      localStorage.setItem("token", token)

      // Set auth header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Fetch the complete user profile to ensure we have all data including profile picture
      const profileResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`)

      // Set user in state with complete profile data
      setCurrentUser(profileResponse.data)

      return profileResponse.data
    } catch (error) {
      console.error("Login error:", error)
      setError(error.response?.data?.message || "Login failed. Please check your credentials.")
      throw error
    }
  }

  // Register function
  const register = async (name, email, password) => {
    try {
      setError(null)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      })

      // Check if response has the expected structure
      if (!response.data || !response.data.token) {
        throw new Error("Invalid response from server")
      }

      const { token } = response.data

      // Save token to localStorage
      localStorage.setItem("token", token)

      // Set auth header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Fetch the complete user profile to ensure we have all data
      const profileResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`)

      // Set user in state with complete profile data
      setCurrentUser(profileResponse.data)

      return profileResponse.data
    } catch (error) {
      console.error("Register error:", error)
      setError(error.response?.data?.message || "Registration failed. Please try again.")
      throw error
    }
  }

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token")

    // Remove auth header
    delete axios.defaults.headers.common["Authorization"]

    // Clear user from state
    setCurrentUser(null)
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null)
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/profile`, userData)

      // Update user in state
      setCurrentUser(response.data)

      return response.data
    } catch (error) {
      console.error("Update profile error:", error)
      setError(error.response?.data?.message || "Failed to update profile")
      throw error
    }
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null)
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/change-password`, {
        currentPassword,
        newPassword,
      })

      return response.data
    } catch (error) {
      console.error("Change password error:", error)
      setError(error.response?.data?.message || "Failed to change password")
      throw error
    }
  }

  // Upload profile picture
  const uploadProfilePicture = async (formData) => {
    try {
      setError(null)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/profile-picture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Update user in state with the complete response data
      setCurrentUser(response.data)

      console.log("Profile picture updated successfully:", response.data)
      return response.data
    } catch (error) {
      console.error("Upload profile picture error:", error)
      setError(error.response?.data?.message || "Failed to upload profile picture")
      throw error
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    uploadProfilePicture,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
