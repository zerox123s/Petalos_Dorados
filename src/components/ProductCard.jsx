import { ShoppingCart, Flower, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, negocio }) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!product.activo) return;
        addToCart(product);
    };

    return (
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group transform hover:-translate-y-1">
            {/* Image Section */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">

                {/* Category Badge (Floating) */}
                <div className="absolute top-5 left-5 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5">
                        <Flower size={14} className="text-pink-600" />
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
            <div className="p-5 pt-4 flex flex-col flex-grow">

                {/* Title & Description */}
                <div className="mb-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                        {product.nombre}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 font-light leading-relaxed">
                        {product.descripcion}
                    </p>
                </div>

                {/* Status Indicator */}
                <div className="mb-4">
                    {product.activo ? (
                        <div className="flex items-center gap-1.5 text-green-600">
                            <Leaf size={16} />
                            <span className="text-sm font-medium">Disponible</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-red-500">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-sm font-medium">No disponible</span>
                        </div>
                    )}
                </div>

                {/* Price & Action */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium mb-0.5">Precio</span>
                        <span className="text-2xl font-bold text-gray-900">
                            S/. {product.precio}
                        </span>
                    </div>

                    {product.activo && (
                        <button
                            onClick={handleAddToCart}
                            className="bg-pink-600 text-white p-3.5 rounded-full hover:bg-pink-700 transition-colors shadow-lg hover:shadow-pink-200 group"
                            title="Añadir al carrito"
                        >
                            <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
