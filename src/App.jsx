import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Tienda from './pages/Tienda'
import Nosotros from './pages/Nosotros' // <--- IMPORTAR NUEVA PÁGINA
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/nosotros" element={<Nosotros />} /> {/* NUEVA RUTA */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App