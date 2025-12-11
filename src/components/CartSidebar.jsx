import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2, MessageSquare, CircleDollarSign } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabase'; // 1. Importar Supabase
import toast from 'react-hot-toast';

export default function CartSidebar() {
    const { isCartOpen, closeCart, cartItems, removeFromCart, addToCart, decreaseQuantity, clearCart, business } = useCart();
    const [isLoading, setIsLoading] = useState(false); // 2. Estado de carga

    const [view, setView] = useState('cart'); // 'cart' | 'checkout'
    const [formData, setFormData] = useState({
        name: '',
        deliveryType: '', // 'delivery', 'recojo'
        date: '',
        time: '',
        phone: '',
        address: '',
        district: '', // New field
        dedication: '',
        observation: ''
    });
    const [errors, setErrors] = useState({});

    // Reset view when closing
    useEffect(() => {
        if (!isCartOpen) {
            setView('cart');
            setErrors({});
        }
    }, [isCartOpen]);

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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Ingresa tu nombre';
        if (!formData.deliveryType) newErrors.deliveryType = 'Selecciona el tipo de entrega';
        if (!formData.date) {
            newErrors.date = 'Selecciona una fecha';
        } else {
            const today = new Date().toLocaleDateString('en-CA');
            if (formData.date < today) {
                newErrors.date = 'La fecha no puede ser pasada';
            }
        }
        if (!formData.time) newErrors.time = 'Selecciona un horario';

        if (formData.deliveryType === 'delivery') {
            if (!formData.district) newErrors.district = 'Selecciona tu distrito';
            if (!formData.address.trim()) newErrors.address = 'Ingresa la dirección de entrega';

            if (!formData.phone.trim()) {
                newErrors.phone = 'Ingresa un teléfono de contacto';
            } else if (formData.phone.length !== 9 || formData.phone[0] !== '9') {
                newErrors.phone = 'El teléfono debe tener 9 dígitos y empezar con 9';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Strict number validation for phone
        if (name === 'phone') {
            let numbersOnly = value.replace(/[^0-9]/g, '');

            // Check prefix '9'
            if (numbersOnly.length > 0 && numbersOnly[0] !== '9') {
                if (numbersOnly.length === 1) return;
            }

            // Max length 9
            if (numbersOnly.length > 9) numbersOnly = numbersOnly.slice(0, 9);

            setFormData(prev => ({ ...prev, [name]: numbersOnly }));
            if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    // 3. Lógica del Checkout
    const processOrder = async () => {
        if (!validateForm()) {
            toast.error('Por favor completa los campos requeridos');
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading('Preparando tu pedido...');

        try {
            // Usamos el negocio del contexto para consistencia y rapidez
            if (!business?.celular_whatsapp) {
                throw new Error('El número de WhatsApp no está configurado en el sistema.');
            }

            // Limpiamos el número para evitar errores (solo dígitos)
            let whatsappNumber = business.celular_whatsapp.replace(/\D/g, '');

            // Agregamos código de país Perú (51) si tiene 9 dígitos
            if (whatsappNumber.length === 9) {
                whatsappNumber = `51${whatsappNumber}`;
            }

            // Si después de limpiar no queda nada o es muy corto, alerta
            if (whatsappNumber.length < 9) {
                throw new Error('El número de la tienda parece inválido. Contáctanos por redes sociales.');
            }

            // Emojis using ES6 Unicode Code Point Escapes (Safe & Robust)
            const e_flower = '\u{1F338}';
            const e_user = '\u{1F464}';
            const e_date = '\u{1F4C5}';
            const e_time = '\u{23F0}';
            const e_moto = '\u{1F6F5}';
            const e_store = '\u{1F3EA}';
            const e_pin = '\u{1F4CD}';
            const e_phone = '\u{1F4F1}';
            const e_gift = '\u{1F381}';
            const e_money = '\u{1F4B0}';
            const e_letter = '\u{1F48C}';
            const e_memo = '\u{1F4DD}';
            const e_square = '\u{25AB}';
            const e_bill = '\u{1F4B5}';
            const e_pic = '\u{1F5BC}';

            // Construir el mensaje del pedido
            let itemsText = cartItems.map(item =>
                `${e_square} *${item.nombre}* (x${item.quantity})\n   ${e_bill} S/. ${(item.precio * item.quantity).toFixed(2)}\n   ${e_pic} Ver foto: ${item.imagen_url}`
            ).join('\n\n');

            const deliveryText = formData.deliveryType === 'delivery' ? `${e_moto} *Envío a Domicilio*` : `${e_store} *Recojo en Tienda*`;
            const timeLabel = formData.deliveryType === 'delivery' ? 'Hora de Entrega' : 'Hora de Recojo';

            // Conditional fields for Delivery
            // Distrito emoji: 🏘️ (\u{1F3D8})
            const addressLine = formData.deliveryType === 'delivery' ? `\n${e_pin} *Dirección:* ${formData.address}\n\u{1F3D8} *Distrito:* ${formData.district}` : '';
            const phoneLine = formData.deliveryType === 'delivery' ? `\n${e_phone} *Teléfono Extra:* ${formData.phone}` : '';

            const fullMessage = `${e_flower} *Hola Pétalos Dorados, me gustaría confirmar este pedido:* ${e_flower}\n\n${e_user} *Soy:* ${formData.name}${phoneLine}\n${e_date} *Fecha de entrega:* ${formData.date}\n${e_time} *${timeLabel}:* ${formData.time}\n${deliveryText}${addressLine}\n\n${e_gift} *Llevo lo siguiente:*\n\n${itemsText}\n\n${e_money} *Total a pagar: S/. ${total.toFixed(2)}*\n\n${e_letter} *Dedicatoria:*\n_${formData.dedication || 'Sin tarjeta'}_\n\n${e_memo} *Nota Adicional:*\n_${formData.observation || 'Ninguna'}_`;

            const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(fullMessage)}`;

            toast.dismiss(loadingToast);
            toast.success('Redirigiendo a WhatsApp...');

            // Redireccionar
            window.open(whatsappUrl, '_blank');

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
                    {/* HEADER */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10 transition-all">
                        <div className="flex items-center gap-3">
                            {view === 'checkout' && (
                                <button onClick={() => setView('cart')} className="mr-1 text-gray-400 hover:text-gray-600">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                            )}
                            <div className={`p-2 rounded-full ${view === 'checkout' ? 'bg-green-100 text-green-600' : 'bg-pink-100 text-[#BE185D]'}`}>
                                {view === 'checkout' ? <MessageSquare size={20} /> : <ShoppingBag size={20} />}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{view === 'checkout' ? 'Finalizar Pedido' : 'Tu Cesta'}</h2>
                                <p className="text-xs text-gray-500 font-medium">
                                    {view === 'checkout' ? 'Confirma tus datos' : `${cartItems.length} items seleccionados`}
                                </p>
                            </div>
                        </div>
                        <button onClick={closeCart} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                        {view === 'checkout' ? (
                            <div className="space-y-6 animate-fade-in">
                                {/* Client Name */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">🙋 Tu Nombre <span className="text-pink-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="¿Quién envía el detalle?"
                                        className={`w-full px-4 py-3 rounded-xl bg-white border focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all ${errors.name ? 'border-red-300 focus:border-red-300' : 'border-gray-200 focus:border-pink-300'}`}
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                                </div>

                                {/* Delivery Type */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Entrega <span className="text-pink-500">*</span></label>
                                    <select
                                        name="deliveryType"
                                        value={formData.deliveryType}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-xl bg-white border focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all appearance-none cursor-pointer ${errors.deliveryType ? 'border-red-300 focus:border-red-300' : 'border-gray-200 focus:border-pink-300'}`}
                                    >
                                        <option value="">Selecciona una opción</option>
                                        <option value="delivery">🛵 Delivery (Envío a domicilio)</option>
                                        <option value="recojo">🏪 Recojo en Tienda</option>
                                    </select>
                                    {errors.deliveryType && <p className="text-red-500 text-xs mt-1 ml-1">{errors.deliveryType}</p>}
                                </div>

                                {/* District Field (Moved up for UX flow) */}
                                {formData.deliveryType === 'delivery' && (
                                    <div className="animate-fade-in">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">🏘️ Distrito de Envío <span className="text-pink-500">*</span></label>
                                        <select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-xl bg-white border focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all appearance-none cursor-pointer ${errors.district ? 'border-red-300 focus:border-red-300' : 'border-gray-200 focus:border-pink-300'}`}
                                        >
                                            <option value="">Selecciona tu distrito</option>
                                            <option value="Túcume">Túcume</option>
                                            <option value="Íllimo">Íllimo</option>
                                            <option value="Pacora">Pacora</option>
                                            <option value="Jayanca">Jayanca</option>
                                            <option value="Mochumí">Mochumí</option>
                                            <option value="Lambayeque">Lambayeque</option>
                                            <option value="Chiclayo">Chiclayo</option>
                                        </select>
                                        {errors.district && <p className="text-red-500 text-xs mt-1 ml-1">{errors.district}</p>}
                                    </div>
                                )}

                                {/* Delivery Date & Time (Row) */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">📅 Fecha <span className="text-pink-500">*</span></label>
                                        <input
                                            type="date"
                                            name="date"
                                            required // Needed for :invalid pseudo-class
                                            min={new Date().toLocaleDateString('en-CA')}
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            placeholder="Selecciona una fecha"
                                            className={`w-full px-4 py-3 rounded-xl bg-white border focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all ${errors.date ? 'border-red-300 focus:border-red-300' : 'border-gray-200 focus:border-pink-300'}`}
                                        />
                                        {errors.date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            ⏰ {formData.deliveryType === 'delivery' ? 'Hora de Entrega' : 'Hora de Recojo'} <span className="text-pink-500">*</span>
                                        </label>
                                        <select
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-xl bg-white border focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all appearance-none cursor-pointer ${errors.time ? 'border-red-300 focus:border-red-300' : 'border-gray-200 focus:border-pink-300'}`}
                                        >
                                            <option value="">{formData.deliveryType === 'delivery' ? '¿A qué hora lo enviamos?' : '¿A qué hora pasas?'}</option>

                                            {(() => {
                                                const timeSlots = [
                                                    { label: "7:00 AM - 9:00 AM", startHour: 7 },
                                                    { label: "9:00 AM - 11:00 AM", startHour: 9 },
                                                    { label: "11:00 AM - 1:00 PM", startHour: 11 },
                                                    { label: "1:00 PM - 3:00 PM", startHour: 13 },
                                                    { label: "3:00 PM - 5:00 PM", startHour: 15 },
                                                    { label: "5:00 PM - 6:00 PM", startHour: 17 }
                                                ];

                                                // Get 'today' in YYYY-MM-DD format based on local time
                                                const today = new Date();
                                                const todayStr = today.toLocaleDateString('en-CA'); // YYYY-MM-DD
                                                const currentHour = today.getHours();

                                                return timeSlots.filter(slot => {
                                                    // 1. Restriction for Chiclayo and Lambayeque (Only afternoon)
                                                    const restrictedDistricts = ['Chiclayo', 'Lambayeque'];
                                                    if (restrictedDistricts.includes(formData.district)) {
                                                        // "Apartir de la 1 hacia las 6" -> Start hour >= 13
                                                        if (slot.startHour < 13) return false;
                                                    }

                                                    // 2. Restriction for "Today" (Hide past hours)
                                                    if (formData.date === todayStr) {
                                                        return slot.startHour > currentHour;
                                                    }

                                                    // Otherwise show all
                                                    return true;
                                                }).map(slot => (
                                                    <option key={slot.label} value={slot.label}>{slot.label}</option>
                                                ));
                                            })()}
                                        </select>
                                        {errors.time && <p className="text-red-500 text-xs mt-1 ml-1">{errors.time}</p>}
                                    </div>
                                </div>

                                {/* Delivery fields (Address & Phone) */}
                                {formData.deliveryType === 'delivery' && (
                                    <div className="space-y-4 animate-fade-in">

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">📍 Dirección de Entrega <span className="text-pink-500">*</span></label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Calle, Número, Referencia..."
                                                className={`w-full px-4 py-3 rounded-xl bg-white border focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all ${errors.address ? 'border-red-300 focus:border-red-300' : 'border-gray-200 focus:border-pink-300'}`}
                                            />
                                            {errors.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">📞 Teléfono de Contacto <span className="text-pink-500">*</span></label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Para coordinar la entrega"
                                                className={`w-full px-4 py-3 rounded-xl bg-white border focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all ${errors.phone ? 'border-red-300 focus:border-red-300' : 'border-gray-200 focus:border-pink-300'}`}
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* Dedication Card */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">💌 Dedicatoria para la Tarjeta</label>
                                    <textarea
                                        name="dedication"
                                        value={formData.dedication}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Escribe aquí el mensaje que irá en la tarjeta..."
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all resize-none"
                                    ></textarea>
                                </div>

                                {/* Additional Notes */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">📝 Instrucciones Adicionales</label>
                                    <textarea
                                        name="observation"
                                        value={formData.observation}
                                        onChange={handleInputChange}
                                        rows="2"
                                        placeholder="Color de lazo, hora preferida, etc."
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-xs text-blue-700">
                                    <MessageSquare size={16} className="mt-0.5 flex-shrink-0" />
                                    <p>La información de tu pedido se enviará directamente a nuestro WhatsApp para coordinar el pago y la entrega.</p>
                                </div>
                            </div>
                        ) : (
                            // CART VIEW
                            <>
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
                            </>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-100 p-6 space-y-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-gray-500 text-sm font-medium">Total a pagar</span>
                                <span className="text-2xl font-bold text-gray-900">S/. {total.toFixed(2)}</span>
                            </div>

                            {view === 'cart' ? (
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={() => setView('checkout')}
                                        className="w-full py-4 rounded-full bg-[#BE185D] text-white font-bold text-lg hover:bg-[#9d174d] transition-all transform hover:scale-[1.02] shadow-lg shadow-pink-200 flex items-center justify-center gap-2 group"
                                    >
                                        <span>Procesar Compra</span>
                                        <CircleDollarSign size={20} className="group-hover:scale-110 transition-transform" />
                                    </button>

                                    <button
                                        onClick={clearCart}
                                        className="w-full py-3 rounded-full text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-red-100"
                                    >
                                        <Trash2 size={16} />
                                        Vaciar Carrito
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={processOrder}
                                    disabled={isLoading}
                                    className="w-full py-4 rounded-full bg-[#25D366] text-white font-bold text-lg hover:bg-[#20bd5a] transition-all transform hover:scale-[1.02] shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 group"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : <MessageSquare size={22} className="text-white fill-current opacity-90" />}
                                    <span>Enviar Pedido al WhatsApp</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}