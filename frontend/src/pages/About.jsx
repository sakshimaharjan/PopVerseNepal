import { FaShippingFast, FaCheckCircle, FaUserFriends } from "react-icons/fa"
import Footer from "../components/Footer"

function About() {
  return (
    <div className="pt-24 pb-12 bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-700 text-white py-16 mb-12">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/placeholder.svg?height=600&width=1200"
            alt="Marvel Collection Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About MarvelPopExpress</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your premier destination for collecting Marvel Funko Pop figures. We're passionate about bringing the
            excitement of the Marvel universe to collectors worldwide.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {/* Our Story Section */}
        <section className="mb-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2025, MarvelPopExpress has grown from a small collector's shop to a leading online marketplace
              for Marvel Funko Pop enthusiasts. Our commitment to quality and authenticity has made us the trusted
              choice for collectors everywhere.
            </p>
            <p className="text-gray-600">
              What started as a passion project by a group of Marvel fans has evolved into a global community of
              collectors sharing their love for these iconic characters. Our team personally curates each collection to
              ensure you get only the best and most authentic items.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src="../hero.png?height=400&width=600" alt="Our Story" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="mb-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
            <img src="../marvel.png?height=400&width=600" alt="Our Mission" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At MarvelPopExpress, our mission is to connect fans with their favorite Marvel characters through
              high-quality collectibles. We believe that every collector deserves access to authentic merchandise that
              celebrates their passion.
            </p>
            <p className="text-gray-600">
              We're committed to creating a community where Marvel enthusiasts can share their collections, discover
              rare finds, and connect with fellow fans. Our goal is to make collecting not just a hobby, but an
              experience.
            </p>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Authentic Products</h3>
              <p className="text-gray-600">
                We guarantee 100% authentic Funko Pop figures directly sourced from official manufacturers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserFriends className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Knowledge</h3>
              <p className="text-gray-600">
                Our team consists of passionate collectors who can help you find the perfect addition to your
                collection.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShippingFast className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Shipping</h3>
              <p className="text-gray-600">
                We ensure quick and secure delivery of your precious collectibles to your doorstep.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-square bg-gray-200">
                  <img
                    src={`/placeholder.svg?height=300&width=300&text=Team Member ${member}`}
                    alt={`Team Member ${member}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg">Team Member {member}</h3>
                  <p className="text-gray-500 text-sm">Marvel Enthusiast</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section>
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">Our Collection Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((img) => (
              <div key={img} className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <img
                  src={`/placeholder.svg?height=300&width=300&text=Marvel ${img}`}
                  alt={`Marvel Collection ${img}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer/>
    </div>
  )
}

export default About
