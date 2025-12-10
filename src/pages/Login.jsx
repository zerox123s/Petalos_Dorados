import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowLeft, Loader2, Flower, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Intentamos iniciar sesión en Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error('Credenciales incorrectas')
      setLoading(false)
    } else {
      toast.success('¡Bienvenido de nuevo!')
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-900">

      {/* Ambient Splashes (Optional subtle details to not ensure it's too boring) */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Floating Glass Card */}
      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in-up">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">

          {/* Header / Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-500/20 rounded-full mb-4 backdrop-blur-sm border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
              <Flower size={40} className="text-pink-300 drop-shadow-md" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Acceso Admin</h1>
            <p className="text-pink-200/80 font-medium">Florería Pétalos Dorados</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Correo Electrónico</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400 group-focus-within:text-pink-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all hover:bg-gray-900/70"
                  placeholder="admin@petalosdorados.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400 group-focus-within:text-pink-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all hover:bg-gray-900/70"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : (
                <>
                  <span>Ingresar al Sistema</span>
                  <Sparkles size={18} className="text-pink-200 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Regresar a la Tienda
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-8">
          &copy; {new Date().getFullYear()} Pétalos Dorados. Panel Administrativo.
        </p>
      </div>
    </div>
  )
}