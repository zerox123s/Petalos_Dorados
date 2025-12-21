import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Tienda from './pages/Tienda'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Categorias from './pages/Categorias'
import Contacto from './pages/Contacto'
import ProductDetail from './pages/ProductDetail'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import { CartProvider } from './context/CartContext'
import CartSidebar from './components/CartSidebar'
import WhatsAppButton from './components/WhatsAppButton'
import GlobalLoader from './components/GlobalLoader'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <GlobalLoader />
        <Toaster position="top-right" containerStyle={{ top: 80 }} />
        <CartSidebar />
        <WhatsAppButton />
        <Routes>
          <Route path="/" element={<Tienda />} />
          <Route path="/acceso-staff-only-x9z2" element={<Login />} />
          <Route path="/admin-panel-secure-7h3x9r" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App

