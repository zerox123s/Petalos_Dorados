import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    // Intentamos iniciar sesión en Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('Error: Usuario o contraseña incorrectos')
    } else {
      // Si todo sale bien, nos manda al Dashboard
      navigate('/admin')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
       <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
         <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Acceso Admin</h1>
         
         <label className="block mb-2 text-sm text-gray-600">Correo</label>
         <input
           type="email"
           required
           className="w-full border border-gray-300 p-2 mb-4 rounded focus:outline-none focus:border-blue-500"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
         />

         <label className="block mb-2 text-sm text-gray-600">Contraseña</label>
         <input
           type="password"
           required
           className="w-full border border-gray-300 p-2 mb-6 rounded focus:outline-none focus:border-blue-500"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
         />

         <button className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition">
           Entrar
         </button>
       </form>
    </div>
  )
}