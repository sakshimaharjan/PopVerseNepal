import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          // Verify token with backend
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          setCurrentUser(response.data)
        }
      } catch (err) {
        // Token is invalid or expired
        localStorage.removeItem("token")
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  // Signup function
  const signup = async (name, email, password) => {
    try {
      setError(null)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      })

      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      throw err
    }
  }

  // Login function
  const login = async (email, password) => {
    try {
      setError(null)
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password })

      // Make sure we're storing the correct data
      const token = res.data.token
      const userData = res.data.user || res.data // Handle both response formats

      // Save user data and token
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))

      // Set default auth header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setCurrentUser(userData)
      return userData
    } catch (err) {
      console.error("Login error in context:", err)
      setError(err.response?.data?.error || err.response?.data?.message || "Login failed")
      throw err
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
