import { ShoppingCart, Flower, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, negocio, onClick }) {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!product.activo) return;
        addToCart(product);
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group transform hover:-translate-y-1 cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">

                {/* Category Badge (Floating) */}
                <div className="absolute top-3 left-3 md:top-5 md:left-5 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] md:text-xs font-bold px-2 py-1 md:px-4 md:py-2 rounded-full shadow-sm flex items-center gap-1 md:gap-1.5">
                        <Flower size={10} className="text-pink-600 md:w-3.5 md:h-3.5" />
                        {product.categorias?.nombre}
                    </span>
                </div>

                <img
                    src={product.imagen_url || 'https://via.placeholder.com/400'}
                    alt={product.nombre}
                    className={`w-full h-full object-cover ${!product.activo ? 'grayscale opacity-60' : ''}`}
                />

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />

                {/* Status Overlay if Out of Stock */}
                {!product.activo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                        <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                            Agotado
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-3 md:p-5 pt-3 md:pt-4 flex flex-col flex-grow">

                {/* Title & Description */}
                <div className="mb-2">
                    <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-1 leading-tight">
                        {product.nombre}
                    </h3>
                    <p className="text-[10px] md:text-sm text-gray-400 line-clamp-2 font-light leading-relaxed">
                        {product.descripcion}
                    </p>
                </div>

                {/* Status Indicator */}
                <div className="mb-3 md:mb-4">
                    {product.activo ? (
                        <div className="flex items-center gap-1.5 text-green-600">
                            <Leaf size={14} className="md:w-4 md:h-4" />
                            <span className="text-[10px] md:text-sm font-medium">Disponible</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-red-500">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-[10px] md:text-sm font-medium">No disponible</span>
                        </div>
                    )}
                </div>

                {/* Price & Action */}
                <div className="mt-auto flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs text-gray-400 font-medium mb-0.5">Precio</span>
                        <span className="text-base md:text-2xl font-bold text-gray-900">
                            S/. {product.precio}
                        </span>
                    </div>

                    {product.activo && (
                        <button
                            onClick={handleAddToCart}
                            className="bg-pink-600 text-white p-2 md:p-3.5 rounded-full hover:bg-pink-700 transition-colors shadow-lg hover:shadow-pink-200 group flex-shrink-0"
                            title="Añadir al carrito"
                        >
                            <ShoppingCart size={18} className="md:w-[22px] md:h-[22px] group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
