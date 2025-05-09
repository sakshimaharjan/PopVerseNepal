"use client"

import { createContext, useState, useEffect, useContext } from "react"

const SettingsContext = createContext()

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    general: {
      storeName: "MarvelPopExpress",
      storeEmail: "contact@marvelpopexpress.com",
      phoneNumber: "+977 9876543210",
      address: "Kathmandu, Nepal",
      currency: "USD",
      language: "en",
    },
    payment: {
      enablePaypal: true,
      enableKhalti: true,
      enableCashOnDelivery: true,
      minimumOrderAmount: 10,
      freeShippingThreshold: 100,
    },
    email: {
      enableOrderConfirmation: true,
      enableShippingUpdates: true,
      enableMarketingEmails: false,
      adminEmailNotification: true,
    },
    security: {
      enableTwoFactorAuth: false,
      passwordExpiryDays: 90,
      sessionTimeout: 30,
    },
  })
  const [loading, setLoading] = useState(true)

  // Load settings from localStorage on initial render
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("app_settings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
      setLoading(false)
    }

    loadSettings()

    // In a real app, you would fetch settings from the API
    // fetchSettings()
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("app_settings", JSON.stringify(settings))
    }
  }, [settings, loading])

  // Function to update settings
  const updateSettings = (category, newSettings) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...newSettings,
      },
    }))
  }

  // In a real app, you would have a function to save settings to the backend
  const saveSettings = async () => {
    try {
      // Simulate API call
      // await axios.post("http://localhost:3000/api/settings", settings, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // })
      return true
    } catch (error) {
      console.error("Error saving settings:", error)
      return false
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        saveSettings,
        loading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
