import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ordering & Payment</h2>

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
                      We accept credit/debit cards, digital wallets (eSewa, Khalti), and bank transfers. All payments
                      are processed securely through our payment gateway.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Is it safe to use my credit card on your website?
                    </h3>
                    <p className="text-gray-600">
                      Yes, all payment information is encrypted using industry-standard SSL technology. We do not store
                      your credit card information on our servers. All transactions are processed through secure payment
                      gateways.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I modify or cancel my order?</h3>
                    <p className="text-gray-600">
                      You can modify or cancel your order within 1 hour of placing it. Please contact our customer
                      service team immediately if you need to make changes to your order.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping & Delivery</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does shipping take?</h3>
                    <p className="text-gray-600">
                      Shipping times vary depending on your location. Typically, orders within Kathmandu are delivered
                      within 1-3 business days, while orders to other parts of Nepal may take 3-7 business days.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you ship internationally?</h3>
                    <p className="text-gray-600">
                      Currently, we only ship within Nepal. We're working on expanding our shipping options to include
                      international destinations in the future.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I track my order?</h3>
                    <p className="text-gray-600">
                      Once your order is shipped, you will receive a tracking number via email. You can use this number
                      to track your package on our website or through the courier's website.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      What if I'm not home when my package arrives?
                    </h3>
                    <p className="text-gray-600">
                      Our delivery partners will attempt to deliver your package twice. If you're not available, they
                      will leave a notice with instructions on how to collect your package or schedule a redelivery.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Returns & Refunds</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">What is your return policy?</h3>
                    <p className="text-gray-600">
                      We accept returns within 7 days of delivery for items in their original condition. Please contact
                      our customer service team to initiate a return.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I return an item?</h3>
                    <p className="text-gray-600">
                      To return an item, please contact our customer service team with your order number and reason for
                      return. We will provide you with a return authorization and instructions on how to send the item
                      back to us.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">When will I receive my refund?</h3>
                    <p className="text-gray-600">
                      Once we receive and inspect the returned item, we will process your refund within 3-5 business
                      days. The time it takes for the refund to appear in your account depends on your payment method
                      and bank.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      What if I received a damaged or defective item?
                    </h3>
                    <p className="text-gray-600">
                      If you receive a damaged or defective item, please contact us within 48 hours of delivery with
                      photos of the damage. We will arrange for a replacement or refund as soon as possible.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Products & Collectibles</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Are your Funko Pops authentic?</h3>
                    <p className="text-gray-600">
                      Yes, all our Funko Pop figures are 100% authentic and sourced from authorized distributors. We do
                      not sell counterfeit or knockoff products.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Do you offer pre-orders for upcoming releases?
                    </h3>
                    <p className="text-gray-600">
                      Yes, we offer pre-orders for select upcoming Funko Pop releases. Pre-order availability is
                      indicated on the product page, and you will be charged only when the item is ready to ship.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">How do you package your collectibles?</h3>
                    <p className="text-gray-600">
                      We take great care in packaging our collectibles to ensure they arrive in perfect condition. Each
                      Funko Pop is individually wrapped in bubble wrap and placed in a sturdy box with additional
                      padding to prevent damage during shipping.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default FAQ
