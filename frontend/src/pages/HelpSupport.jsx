import Navbar from "../components/Navbar"

function HelpSupport() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Help & Support</h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 mb-6">
              Find answers to the most common questions about our products and services.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I place an order?</h3>
                <p className="text-gray-600">
                  Browse our collection, select the items you want, add them to your cart, and proceed to checkout.
                  Follow the instructions to complete your purchase.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept credit/debit cards, digital wallets, and bank transfers. All payments are processed securely
                  through our payment gateway.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does shipping take?</h3>
                <p className="text-gray-600">
                  Shipping times vary depending on your location. Typically, orders within Kathmandu are delivered
                  within 1-3 business days, while orders to other parts of Nepal may take 3-7 business days.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What is your return policy?</h3>
                <p className="text-gray-600">
                  We accept returns within 7 days of delivery for items in their original condition. Please contact our
                  customer service team to initiate a return.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Support</h2>
            <p className="text-gray-600 mb-6">Need more help? Our support team is ready to assist you.</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600">support@popversenepal.com</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                <p className="text-gray-600">+977 1234567890</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Hours</h3>
                <p className="text-gray-600">Sunday - Friday: 10:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Information</h2>
            <p className="text-gray-600 mb-6">Learn about our shipping policies and delivery times.</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Delivery Areas</h3>
                <p className="text-gray-600">
                  We currently deliver to all major cities in Nepal. For remote areas, additional shipping charges may
                  apply.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Shipping Costs</h3>
                <p className="text-gray-600">
                  Shipping costs are calculated based on your location and the weight of your order. Free shipping is
                  available for orders above NPR 5,000.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Order Tracking</h3>
                <p className="text-gray-600">
                  Once your order is shipped, you will receive a tracking number via email to monitor your delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HelpSupport
