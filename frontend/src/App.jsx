import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider } from "./components/AuthContext"
import { CartProvider } from "./components/CartContext"
import { SettingsProvider } from "./components/SettingsContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductPage from "./pages/ProductPage"
import Cart from "./pages/Cart"
import Orders from "./pages/Orders"
import Login from "./pages/Login"
import SignUp from "./pages/Signup"
import UserDashboard from "./pages/UserDashboard"
import NotFound from "./pages/NotFound"
import NotAuthorized from "./pages/NotAuthorized"
import Contact from "./pages/Contact"
import About from "./pages/About"
import ScrollToTop from "./components/ScrollToTop"
import Dashboard from "./pages/admin/Dashboard"
import ProductManagement from "./pages/admin/ProductManagement"
import OrderManagement from "./pages/admin/OrderManagement"
import ContactManagement from "./pages/admin/ContactManagement"
import Settings from "./pages/admin/Settings"
import UserManagement from "./pages/admin/UserManagement"
import HelpSupport from "./pages/HelpSupport"
import Checkout from "./pages/Checkout"
import KhaltiScript from "./components/KhaltiScript"
import TermsConditions from "./pages/TermsConditions"
import Policy from "./pages/Policy"
import FAQ from "./pages/FAQ"

// Layout wrapper to conditionally render Navbar and Footer
const AppLayout = ({ children }) => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
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
          <SettingsProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/helpandsupport" element={<HelpSupport />} />
                <Route path="/not-authorized" element={<NotAuthorized />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacypolicy" element={<Policy />} />
                <Route path="/terms-and-conditions" element={<TermsConditions />} />
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
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <ProductManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <OrderManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/contacts"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <ContactManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </SettingsProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
