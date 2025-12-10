import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabase'; // 1. Importar Supabase
import toast from 'react-hot-toast';

export default function CartSidebar() {
    const { isCartOpen, closeCart, cartItems, removeFromCart, addToCart, decreaseQuantity, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false); // 2. Estado de carga

    // Lock body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    const total = cartItems.reduce((acc, item) => acc + (item.precio * item.quantity), 0);

    // 3. Lógica del Checkout
    const handleCheckout = async () => {
        setIsLoading(true);
        const loadingToast = toast.loading('Preparando tu pedido...');

        try {
            const { data: negocioData, error } = await supabase.from('negocio').select('celular_whatsapp, mensaje_pedidos').single();

            if (error || !negocioData?.celular_whatsapp) {
                throw new Error('El número de WhatsApp no está configurado.');
            }

            const { celular_whatsapp, mensaje_pedidos } = negocioData;

            // Construir el mensaje del pedido
            let itemsText = cartItems.map(item =>
                `- ${item.nombre} (x${item.quantity}) - S/. ${(item.precio * item.quantity).toFixed(2)}`
            ).join('\n');

            const fullMessage = `${mensaje_pedidos || 'Hola, quisiera hacer el siguiente pedido:'}\n\n*Mi Pedido:*\n${itemsText}\n\n*Total: S/. ${total.toFixed(2)}*`;

            const whatsappUrl = `https://wa.me/${celular_whatsapp}?text=${encodeURIComponent(fullMessage)}`;

            toast.dismiss(loadingToast);
            toast.success('Redirigiendo a WhatsApp...');

            // Redireccionar
            window.open(whatsappUrl, '_blank');

            // Opcional: Limpiar el carrito después de redirigir
            // clearCart();

        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error(err.message || 'No se pudo completar el pedido.');
        } finally {
            setIsLoading(false);
        }
    };


    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={closeCart} />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-[90vw] max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3"><ShoppingBag className="text-pink-600" /><h2 className="text-lg font-bold text-gray-800">Tu Carrito</h2></div>
                        <button onClick={closeCart} className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><X size={20} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <ShoppingBag size={40} className="text-gray-300 mb-4" />
                                <p className="font-medium text-lg">Tu carrito está vacío</p>
                                <button onClick={closeCart} className="mt-4 text-pink-600 font-medium">Seguir comprando</button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <img src={item.imagen_url || 'https://via.placeholder.com/100'} alt={item.nombre} className="w-20 h-20 rounded-lg object-cover border" />
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.nombre}</h3>
                                                <p className="text-xs text-gray-500">{item.categorias?.nombre}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                                                    <button onClick={() => decreaseQuantity(item.id)} className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-pink-600">
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                                                    <button onClick={() => addToCart(item, 1, false)} className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-pink-600">
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-gray-900 text-sm">S/. {(item.precio * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id, false)} className="text-gray-400 hover:text-red-500 self-start p-1"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="border-t bg-gray-50 p-6 space-y-4">
                            <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>S/. {total.toFixed(2)}</span></div>
                            <div className="flex justify-between text-lg font-bold text-gray-900"><span>Total</span><span>S/. {total.toFixed(2)}</span></div>
                            <button onClick={clearCart} className="w-full text-center text-xs text-gray-500 hover:text-red-500 underline">Vaciar carrito</button>
                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className="w-full px-4 py-4 rounded-xl bg-green-500 text-white font-bold text-base hover:bg-green-600 transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <MessageSquare size={20} />}
                                Comprar por WhatsApp
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}