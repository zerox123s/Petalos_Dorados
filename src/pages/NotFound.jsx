import { Link } from 'react-router-dom';
import { Home, Flower2, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center px-4">
            <SEO
                title="Página no encontrada"
                description="La página que buscas no existe. Vuelve a nuestra tienda de flores."
            />

            <div className="text-center max-w-md">
                {/* Icono decorativo */}
                <div className="relative inline-block mb-8">
                    <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                        <Flower2 size={64} className="text-pink-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        ?
                    </div>
                </div>

                {/* Texto */}
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    ¡Ups! Esta flor no existe
                </h2>
                <p className="text-gray-500 mb-8">
                    Parece que la página que buscas se marchitó o nunca floreció.
                    No te preocupes, tenemos muchas flores hermosas esperándote.
                </p>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Home size={20} />
                        Ir a la tienda
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-full font-semibold border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        <ArrowLeft size={20} />
                        Volver atrás
                    </button>
                </div>
            </div>
        </div>
    );
}
