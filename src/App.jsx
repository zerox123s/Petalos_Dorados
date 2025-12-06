import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Tienda from './pages/Tienda'
import Nosotros from './pages/Nosotros'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Categorias from './pages/Categorias'
import { CartProvider } from './context/CartContext'
import CartSidebar from './components/CartSidebar'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Toaster position="top-right" />
        <CartSidebar />
        <Routes>
          <Route path="/" element={<Tienda />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/categorias" element={<Categorias />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App