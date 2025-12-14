import { HashRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Tienda from './pages/Tienda'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Categorias from './pages/Categorias'
import Contacto from './pages/Contacto'
import ProductDetail from './pages/ProductDetail'
import ProtectedRoute from './components/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import CartSidebar from './components/CartSidebar'
import WhatsAppButton from './components/WhatsAppButton'

function App() {
  return (
    <HashRouter>
      <CartProvider>
        <Toaster position="top-right" containerStyle={{ top: 80 }} />
        <CartSidebar />
        <WhatsAppButton />
        <Routes>
          <Route path="/" element={<Tienda />} />
          <Route path="/chija" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
        </Routes>
      </CartProvider>
    </HashRouter>
  )
}

export default App
