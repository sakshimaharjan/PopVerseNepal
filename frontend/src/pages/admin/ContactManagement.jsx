import { useState, useEffect } from "react"
import { FiRefreshCw, FiMail, FiCheck, FiEye, FiX } from "react-icons/fi"
import AdminLayout from "../../components/AdminLayout"
import axios from "axios"

function ContactManagement() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selectedContact, setSelectedContact] = useState(null)
  const [showContactDetails, setShowContactDetails] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/contact/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setContacts(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching contacts:", error)
      setLoading(false)
    }
  }

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-yellow-100 text-yellow-800"
      case "read":
        return "bg-blue-100 text-blue-800"
      case "responded":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter contacts based on selected filter
  const filteredContacts = filter === "all" ? contacts : contacts.filter((contact) => contact.status === filter)

  // View contact details
  const viewContactDetails = (contact) => {
    setSelectedContact(contact)
    setShowContactDetails(true)
    
    // If the contact is new, mark it as read
    if (contact.status === "new") {
      updateContactStatus(contact._id, "read")
    }
  }

  // Update contact status
  const updateContactStatus = async (contactId, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/contact/${contactId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      // Update local state
      setContacts(contacts.map((contact) => (contact._id === contactId ? { ...contact, status } : contact)))

      // Update selected contact if it's the one being viewed
      if (selectedContact && selectedContact._id === contactId) {
        setSelectedContact({ ...selectedContact, status })
      }
    } catch (error) {
      console.error("Error updating contact status:", error)
      alert("Error updating contact status. Please try again.")
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <button
            onClick={fetchContacts}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FiRefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-2">
            <FiMail className="text-gray-500" />
            <span className="text-gray-700 font-medium">Filter by Status:</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === "all" ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              All Messages
            </button>
            <button
              onClick={() => setFilter("new")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === "new" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              New
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === "read" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              Read
            </button>
            <button
              onClick={() => setFilter("responded")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === "responded" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              Responded
            </button>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading messages...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No messages found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contact.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}
                        >
                          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => viewContactDetails(contact)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Contact Details Modal */}
      {showContactDetails && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Message Details</h2>
                <button onClick={() => setShowContactDetails(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{selectedContact.subject}</h3>
                    <p className="text-sm text-gray-500 mt-1">From: {selectedContact.name} ({selectedContact.email})</p>
                    <p className="text-sm text-gray-500">Received: {formatDate(selectedContact.createdAt)}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedContact.status)}`}
                  >
                    {selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <p className="whitespace-pre-wrap">{selectedContact.message}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateContactStatus(selectedContact._id, "read")}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                  disabled={selectedContact.status === "read"}
                >
                  <FiEye size={16} />
                  <span>Mark as Read</span>
                </button>
                <button
                  onClick={() => updateContactStatus(selectedContact._id, "responded")}
                  className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                  disabled={selectedContact.status === "responded"}
                >
                  <FiCheck size={16} />
                  <span>Mark as Responded</span>
                </button>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <FiMail size={16} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default ContactManagement
