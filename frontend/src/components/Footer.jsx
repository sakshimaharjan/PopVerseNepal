import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black py-10 border-t">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
        <h2 className="text-lg font-bold">PopVerseNepal</h2> {/*Need to add logo here */}
                <p className="text-sm mt-2">Discover the perfect, stylish funko pops.</p>
                <div className="flex space-x-4 mt-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="text-2xl cursor-pointer hover:text-gray-600" />
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="text-2xl cursor-pointer hover:text-gray-600" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="text-2xl cursor-pointer hover:text-gray-600" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="text-2xl cursor-pointer hover:text-gray-600" />
                </a>
                </div>
              </div>

              {/* Categories */}
        <div>
          <h3 className="text-lg font-bold">CATEGORY</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Exclusive Edition</a></li>
            <li><a href="#" className="hover:underline">Limited Edition</a></li>
            <li><a href="#" className="hover:underline">Offers</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-bold">SUPPORT</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Help & Support</a></li>
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Help</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-bold">NEWSLETTER</h3>
          <div className="flex mt-2">
            <input type="email" placeholder="Your email" className="w-full p-2 border rounded"/>
            <button className="bg-teal-500 text-white px-4 py-2 ml-2 rounded hover:bg-teal-600">
              Subscribe
            </button>
          </div>
          <p className="text-sm mt-2">Don't miss out on new products & deals! Subscribe now.</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-6 text-sm border-t pt-4">
        &copy; 2024 - Designed & Developed by PopVerseNepal
      </div>
    </footer>
  );
};

export default Footer;
