function About() {
  return (
    <div className="pt-24 px-8 max-w-7xl mx-auto">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">About MarvelPopExpress</h1>
        <p className="text-gray-600">Welcome to MarvelPopExpress, your premier destination for collecting Marvel Funko Pop figures. We're passionate about bringing the excitement of the Marvel universe to collectors worldwide.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Story</h2>
        <p className="text-gray-600">Founded in 2025, MarvelPopExpress has grown from a small collector's shop to a leading online marketplace for Marvel Funko Pop enthusiasts. Our commitment to quality and authenticity has made us the trusted choice for collectors everywhere.</p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Authentic Products</h3>
            <p className="text-gray-600">We guarantee 100% authentic Funko Pop figures directly sourced from official manufacturers.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Expert Knowledge</h3>
            <p className="text-gray-600">Our team consists of passionate collectors who can help you find the perfect addition to your collection.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Fast Shipping</h3>
            <p className="text-gray-600">We ensure quick and secure delivery of your precious collectibles to your doorstep.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;