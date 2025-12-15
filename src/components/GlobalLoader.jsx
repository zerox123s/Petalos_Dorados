import { useCart } from '../context/CartContext';
import { Loader2, Flower } from 'lucide-react';

export default function GlobalLoader() {
    const { isShopLoading, business } = useCart();

    if (!isShopLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center animate-fade-in-up">
                <div className="bg-pink-50 p-6 rounded-full mb-6 relative">
                    <Flower size={64} className="text-[#BE185D]" />
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
                        <Loader2 size={24} className="text-[#BE185D] animate-spin" />
                    </div>
                </div>

                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#BE185D] mb-3 text-center">
                    {business?.nombre_tienda || 'Pétalos Dorados'}
                </h1>

                <p className="text-gray-400 text-sm tracking-[0.2em] uppercase font-medium animate-pulse">
                    Cargando...
                </p>
            </div>
        </div>
    );
}
