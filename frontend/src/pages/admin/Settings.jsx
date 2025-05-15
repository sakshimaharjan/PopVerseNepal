import { useState, useEffect } from "react"
import { FiSave, FiRefreshCw, FiGlobe, FiMail, FiShield, FiCreditCard, FiAlertCircle } from "react-icons/fi"
import AdminLayout from "../../components/AdminLayout"

function Settings() {
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "MarvelPopExpress",
    storeEmail: "contact@marvelpopexpress.com",
    phoneNumber: "+977 9876543210",
    address: "Kathmandu, Nepal",
    currency: "USD",
    language: "en",
  })

  const [paymentSettings, setPaymentSettings] = useState({
    enablePaypal: true,
    enableKhalti: true,
    enableCashOnDelivery: true,
    minimumOrderAmount: 10,
    freeShippingThreshold: 100,
  })

  const [emailSettings, setEmailSettings] = useState({
    enableOrderConfirmation: true,
    enableShippingUpdates: true,
    enableMarketingEmails: false,
    adminEmailNotification: true,
  })

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactorAuth: false,
    passwordExpiryDays: 90,
    sessionTimeout: 30,
  })

  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // Load settings from localStorage on initial render
  useEffect(() => {
    const loadSettings = () => {
      const savedGeneralSettings = localStorage.getItem("general_settings")
      const savedPaymentSettings = localStorage.getItem("payment_settings")
      const savedEmailSettings = localStorage.getItem("email_settings")
      const savedSecuritySettings = localStorage.getItem("security_settings")

      if (savedGeneralSettings) setGeneralSettings(JSON.parse(savedGeneralSettings))
      if (savedPaymentSettings) setPaymentSettings(JSON.parse(savedPaymentSettings))
      if (savedEmailSettings) setEmailSettings(JSON.parse(savedEmailSettings))
      if (savedSecuritySettings) setSecuritySettings(JSON.parse(savedSecuritySettings))
    }

    loadSettings()
    // In a real app, you would fetch settings from the API
    // fetchSettings()
  }, [])

  const handleGeneralChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target
    setPaymentSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseFloat(value) : value,
    }))
  }

  const handleEmailChange = (e) => {
    const { name, checked } = e.target
    setEmailSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Save settings to localStorage
      localStorage.setItem("general_settings", JSON.stringify(generalSettings))
      localStorage.setItem("payment_settings", JSON.stringify(paymentSettings))
      localStorage.setItem("email_settings", JSON.stringify(emailSettings))
      localStorage.setItem("security_settings", JSON.stringify(securitySettings))

      // In a real app, you would save settings to the API
      // await axios.post("import.meta.env.VITE_API_URL/api/settings", {
      //   general: generalSettings,
      //   payment: paymentSettings,
      //   email: emailSettings,
      //   security: securitySettings
      // }, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error saving settings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? <FiRefreshCw className="animate-spin" size={16} /> : <FiSave size={16} />}
            <span>{loading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
            <FiAlertCircle className="mr-2" />
            Settings saved successfully!
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 cursor-pointer ${
                activeTab === "general"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiGlobe size={16} />
              General
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 cursor-pointer ${
                activeTab === "payment"
                  ? "border-b-2 border-indigo-600 text-indigo-600 "
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiCreditCard size={16} />
              Payment
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 cursor-pointer ${
                activeTab === "email"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiMail size={16} />
              Email
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 cursor-pointer ${
                activeTab === "security"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FiShield size={16} />
              Security
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div>
              <h2 className="text-lg font-medium mb-6 pb-2 border-b">General Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={generalSettings.storeName}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
                  <input
                    type="email"
                    name="storeEmail"
                    value={generalSettings.storeEmail}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={generalSettings.phoneNumber}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={generalSettings.address}
                    onChange={handleGeneralChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      name="currency"
                      value={generalSettings.currency}
                      onChange={handleGeneralChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="NPR">NPR (रू)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      name="language"
                      value={generalSettings.language}
                      onChange={handleGeneralChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="ne">Nepali</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === "payment" && (
            <div>
              <h2 className="text-lg font-medium mb-6 pb-2 border-b">Payment Settings</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-medium mb-3">Payment Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="PayPal" className="h-8 mr-3" />
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-gray-500">Accept payments via PayPal</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="enablePaypal"
                          checked={paymentSettings.enablePaypal}
                          onChange={handlePaymentChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <img src="https://blog.khalti.com/wp-content/uploads/2021/01/khalti-icon.png" alt="Khalti" className="h-8 mr-3" />
                        <div>
                          <p className="font-medium">Khalti</p>
                          <p className="text-sm text-gray-500">Accept payments via Khalti Digital Wallet</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="enableKhalti"
                          checked={paymentSettings.enableKhalti}
                          onChange={handlePaymentChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 mr-3">
                          <FiCreditCard size={20} />
                        </div>
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-gray-500">Allow customers to pay when they receive their order</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="enableCashOnDelivery"
                          checked={paymentSettings.enableCashOnDelivery}
                          onChange={handlePaymentChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount ($)</label>
                    <input
                      type="number"
                      name="minimumOrderAmount"
                      value={paymentSettings.minimumOrderAmount}
                      onChange={handlePaymentChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-500">Minimum amount required to place an order</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold ($)</label>
                    <input
                      type="number"
                      name="freeShippingThreshold"
                      value={paymentSettings.freeShippingThreshold}
                      onChange={handlePaymentChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-500">Order amount to qualify for free shipping</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === "email" && (
            <div>
              <h2 className="text-lg font-medium mb-6 pb-2 border-b">Email Notifications</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-medium mb-3">Customer Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                      <div>
                        <p className="font-medium">Order Confirmation</p>
                        <p className="text-sm text-gray-500">Send email when a customer places an order</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="enableOrderConfirmation"
                          checked={emailSettings.enableOrderConfirmation}
                          onChange={handleEmailChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                      <div>
                        <p className="font-medium">Shipping Updates</p>
                        <p className="text-sm text-gray-500">Send email when order status changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="enableShippingUpdates"
                          checked={emailSettings.enableShippingUpdates}
                          onChange={handleEmailChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-gray-500">Send promotional emails to customers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="enableMarketingEmails"
                          checked={emailSettings.enableMarketingEmails}
                          onChange={handleEmailChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-medium mb-3">Admin Notifications</h3>
                  <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                    <div>
                      <p className="font-medium">Admin Notifications</p>
                      <p className="text-sm text-gray-500">Receive email notifications for new orders and activities</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="adminEmailNotification"
                        checked={emailSettings.adminEmailNotification}
                        onChange={handleEmailChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-lg font-medium mb-6 pb-2 border-b">Security Settings</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="font-medium mb-3">Authentication</h3>
                  <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">
                        Require a verification code in addition to password for login
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="enableTwoFactorAuth"
                        checked={securitySettings.enableTwoFactorAuth}
                        onChange={handleSecurityChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (days)</label>
                    <input
                      type="number"
                      name="passwordExpiryDays"
                      value={securitySettings.passwordExpiryDays}
                      onChange={handleSecurityChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Number of days after which users must change their password (0 = never)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      name="sessionTimeout"
                      value={securitySettings.sessionTimeout}
                      onChange={handleSecurityChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Time of inactivity after which users are automatically logged out
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default Settings
