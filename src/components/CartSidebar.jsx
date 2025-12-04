import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartSidebar() {
    const { isCartOpen, closeCart, cartItems, removeFromCart, addToCart, clearCart } = useCart();

    const total = cartItems.reduce((acc, item) => acc + (item.precio * item.quantity), 0);

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] overflow-hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-pink-700 bg-pink-600">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="text-white" />
                            <h2 className="text-lg font-bold text-white">Tu Carrito</h2>
                            <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {cartItems.length} items
                            </span>
                        </div>
                        <button
                            onClick={closeCart}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                    <ShoppingBag size={40} className="text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium text-lg">Tu carrito está vacío</p>
                                    <p className="text-gray-500 text-sm mt-1">¡Agrega algunas flores hermosas!</p>
                                </div>
                                <button
                                    onClick={closeCart}
                                    className="mt-4 text-pink-600 font-medium hover:text-pink-700 text-sm"
                                >
                                    Seguir comprando
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        {/* Image */}
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                            <img
                                                src={item.imagen_url || 'https://via.placeholder.com/100'}
                                                alt={item.nombre}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.nombre}</h3>
                                                <p className="text-xs text-gray-500 mt-0.5">{item.categorias?.nombre}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                                    <button
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-pink-600 disabled:opacity-50"
                                                        disabled
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-pink-600"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-gray-900 text-sm">
                                                    S/. {(item.precio * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors self-start p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>S/. {total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>S/. {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={clearCart}
                                    className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-colors"
                                >
                                    Vaciar
                                </button>
                                <button
                                    className="px-4 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200"
                                    onClick={() => alert('Checkout no implementado aún')}
                                >
                                    Comprar Ahora
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
