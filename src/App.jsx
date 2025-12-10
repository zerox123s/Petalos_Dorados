import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Tienda from './pages/Tienda'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Categorias from './pages/Categorias'
import Contacto from './pages/Contacto'
import { CartProvider } from './context/CartContext'
import CartSidebar from './components/CartSidebar'
import WhatsAppButton from './components/WhatsAppButton'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Toaster position="top-right" containerStyle={{ top: 80 }} />
        <CartSidebar />
        <WhatsAppButton />
        <Routes>
          <Route path="/" element={<Tienda />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App