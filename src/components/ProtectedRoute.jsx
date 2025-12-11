import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../supabase'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children }) {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <Loader2 size={40} className="text-pink-500 animate-spin" />
            </div>
        )
    }

    // Estrategia Silenciosa: Si no hay usuario, redirigir al Home en lugar del Login
    // para no revelar que esta es una ruta restringida.
    if (!session) {
        return <Navigate to="/" replace />
    }

    return children ? children : <Outlet />
}
