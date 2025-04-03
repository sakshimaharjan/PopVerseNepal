import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
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
import Contact from './pages/Contact'
import About from './pages/About'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/About" element={<About />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contact" element={<Contact />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
