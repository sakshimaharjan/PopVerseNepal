import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider } from "./components/AuthContext"
import { CartProvider } from "./components/CartContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductPage from "./pages/ProductPage"
import Cart from "./pages/Cart"
import Orders from "./pages/Orders"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import UserDashboard from "./pages/UserDashboard"
import NotFound from "./pages/NotFound"
import Contact from "./pages/Contact"
import About from "./pages/About"
import ScrollToTop from "./components/ScrollToTop"
import Dashboard from "./pages/admin/Dashboard"
import ProductManagement from "./pages/admin/ProductManagement"
import OrderManagement from "./pages/admin/OrderManagement"
import ContactManagement from "./pages/admin/ContactManagement"
import HelpSupport from "./pages/HelpSupport"
import Checkout from "./pages/Checkout"
import KhaltiScript from "./components/KhaltiScript"

// Layout wrapper to conditionally render Navbar and Footer
const AppLayout = ({ children }) => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {/* <div className="mt-24"> */}
      {children}
      {/* </div> */}
      {!isAdminRoute && <Footer />}
    </>
  )
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <KhaltiScript />
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/helpandsupport" element={<HelpSupport />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <Orders />
              }
            />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute>
                    <ProductManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute>
                    <OrderManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/contacts"
                element={
                  <ProtectedRoute>
                    <ContactManagement />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App