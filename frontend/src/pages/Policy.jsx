import React from 'react';

function Policy() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <p className="text-gray-600 mb-6">
              At PopVerseNepal, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website.
            </p>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-600 mb-4">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Register for an account</li>
                  <li>Place an order</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us</li>
                  <li>Participate in promotions or surveys</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  The personal information we collect may include your name, email address, phone number, billing address, 
                  shipping address, payment information, and other information you choose to provide.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">
                  We may use the information we collect for various purposes, including to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Create and manage your account</li>
                  <li>Send you order confirmations and updates</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Protect against fraud and unauthorized transactions</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookies and Tracking Technologies</h2>
                <p className="text-gray-600">
                  We may use cookies, web beacons, and similar tracking technologies to collect information about how you use 
                  our website. This information helps us improve your browsing experience, analyze website usage, and personalize 
                  content. You can control cookies through your browser settings.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
                <p className="text-gray-600 mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Service providers who help us operate our business (payment processors, shipping companies, etc.)</li>
                  <li>Legal authorities when required by law</li>
                  <li>Business partners with your consent</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate security measures to protect your personal information from unauthorized access, 
                  alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
                  storage is 100% secure, so we cannot guarantee absolute security.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                <p className="text-gray-600 mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate information</li>
                  <li>Deletion of your information</li>
                  <li>Restriction of processing</li>
                  <li>Data portability</li>
                  <li>Objection to processing</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Changes to This Privacy Policy</h2>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. The updated version will be indicated by an updated 
                  "Revised" date and the updated version will be effective as soon as it is accessible.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
                <p className="text-gray-600">
                  If you have questions or concerns about this Privacy Policy, please contact us at:
                  <br /><br />
                  Email: privacy@popversenepal.com<br />
                  Phone: +977 1234567890
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Policy;
