import { X, ShoppingCart, Leaf, Share2, Minus, Plus, Flower } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ProductDetailModal({ product, onClose }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    // ... code ...

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (product) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [product]);

    if (!product) return null;

    const handleAddToCart = () => {
        if (!product.activo) return;
        addToCart(product, quantity);
        onClose();
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleShare = async () => {
        const shareData = {
            title: product.nombre,
            text: `¡Mira este hermoso arreglo que encontré en Pétalos Dorados!`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error al compartir', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('¡Enlace copiado al portapapeles!');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-4xl rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[600px] animate-fade-in-up">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-md text-gray-500 hover:text-gray-900 transition-all hover:scale-110"
                >
                    <X size={24} />
                </button>

                {/* Image Section (Left/Top) */}
                <div className="w-full md:w-1/2 relative bg-gray-50 flex-shrink-0 h-80 md:h-auto group">
                    <img
                        src={product.imagen_url || 'https://via.placeholder.com/600'}
                        alt={product.nombre}
                        className="w-full h-full object-cover"
                    />
                    {/* Category Badge - Updated to Match ProductCard */}
                    <div className="absolute top-6 left-6 z-10">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                            <Flower size={14} className="text-pink-600" />
                            {product.categorias?.nombre}
                        </span>
                    </div>
                    {/* Share Button (Floating on Image) */}
                    <button
                        onClick={handleShare}
                        className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-gray-500 hover:text-pink-600 hover:scale-110 transition-all z-10"
                        title="Compartir"
                    >
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Details Section (Right/Bottom) - Fixed Layout */}
                <div className="w-full md:w-1/2 flex flex-col bg-white h-full relative overflow-hidden">

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-5 md:p-10">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">{product.nombre}</h2>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-pink-600">S/. {product.precio}</span>
                            {product.activo ? (
                                <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                                    <Leaf size={14} />
                                    <span>Disponible</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span>Agotado</span>
                                </div>
                            )}
                        </div>

                        <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light border-l-4 border-pink-100 pl-4">
                            {product.descripcion}
                        </p>

                        {/* Quantity Selector */}
                        {product.activo && (
                            <div className="mb-4">
                                <span className="block text-sm font-bold text-gray-700 mb-3">Cantidad</span>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-gray-50 rounded-full border border-gray-200">
                                        <button
                                            onClick={decrementQuantity}
                                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-pink-600 transition-colors disabled:opacity-50"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="w-8 text-center font-bold text-gray-900 text-lg">{quantity}</span>
                                        <button
                                            onClick={incrementQuantity}
                                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-pink-600 transition-colors"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Fixed Action Footer */}
                    <div className="p-4 md:p-10 border-t border-gray-100 bg-white flex-shrink-0 z-10 w-full">
                        {product.activo ? (
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-pink-600 text-white px-6 py-4 rounded-full font-bold shadow-lg hover:bg-pink-700 hover:shadow-pink-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 whitespace-nowrap text-sm md:text-base"
                            >
                                <ShoppingCart size={20} className="flex-shrink-0" />
                                <span>Agregar  •  S/. {(product.precio * quantity).toFixed(2)}</span>
                            </button>
                        ) : (
                            <button
                                disabled
                                className="w-full bg-gray-200 text-gray-400 px-8 py-4 rounded-full font-bold cursor-not-allowed flex items-center justify-center gap-3 whitespace-nowrap"
                            >
                                No disponible
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
