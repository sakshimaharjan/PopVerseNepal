"use client"

import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // API URL derived from VITE_API_URL (Vite convention)
  const API_URL = `${import.meta.env.VITE_API_URL}/api`

  useEffect(() => {
    // Check if user is logged in on page load
    const token = localStorage.getItem("token")
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user"))
      setCurrentUser(userData)

      // Set default auth header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const res = await axios.post(`${API_URL}/auth/login`, { email, password })

      // Save user data and token
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data))

      // Set default auth header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`

      setCurrentUser(res.data)
      return res.data
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Login failed")
      throw err
    }
  }

  const signup = async (name, email, password) => {
    try {
      setError(null)
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password })
      return res.data
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "Signup failed")
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete axios.defaults.headers.common["Authorization"]
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
