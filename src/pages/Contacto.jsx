import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Phone, MapPin, Clock, Facebook, Instagram, Send, MessageSquare, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contacto() {
    // Consume Global Context
    const { business: negocio, isShopLoading: loading } = useCart();

    const [formData, setFormData] = useState({
        nombre: '',
        celular: '',
        mensaje: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.nombre || !formData.celular || !formData.mensaje) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        if (!negocio?.celular_whatsapp) {
            toast.error('El número de contacto no está configurado');
            return;
        }

        const message = `*Hola, vengo de la web y quisiera contactarme:*\n\n*Nombre:* ${formData.nombre}\n*Celular:* ${formData.celular}\n*Mensaje:* ${formData.mensaje}`;
        const url = `https://wa.me/${negocio.celular_whatsapp}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
        setFormData({ nombre: '', celular: '', mensaje: '' });
    };

    return (
        <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">

                {/* 1. Hero / Header Section - Aligned with Categorias.jsx */}
                <section className="pt-10 md:pt-[2.5rem] pb-4 md:pb-6 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
                    <span className="inline-block py-1 px-3 rounded-full bg-pink-100 text-[#BE185D] text-xs font-bold tracking-widest uppercase mb-2">
                        Estamos para servirte
                    </span>
                    <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
                        Hablemos de <span className="text-[#BE185D]">Flores</span>
                    </h1>
                    <p className="text-gray-500 text-sm md:text-lg font-light max-w-2xl mx-auto">
                        Ya sea para un regalo especial, una boda de ensueño o simplemente para alegrar tu día. Visítanos o escríbenos.
                    </p>
                </section>

                <div className="pt-2 pb-10 md:py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* 2. Floating Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">

                        {/* Card 1: Phone */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center text-center group">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-[#BE185D] group-hover:bg-[#BE185D] group-hover:text-white transition-colors mb-4 md:mb-6">
                                <Phone size={24} className="md:w-7 md:h-7" />
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">Llámanos / WhatsApp</h3>
                            <p className="text-gray-500 mb-4 text-xs md:text-sm">Estamos disponibles para atenderte</p>
                            <p className="text-lg md:text-xl font-bold text-[#BE185D] font-mono">{negocio?.telefono || 'Cargando...'}</p>
                        </div>

                        {/* Card 2: Location */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center text-center group">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-[#BE185D] group-hover:bg-[#BE185D] group-hover:text-white transition-colors mb-4 md:mb-6">
                                <MapPin size={24} className="md:w-7 md:h-7" />
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">Nuestra Ubicación</h3>
                            <p className="text-gray-500 mb-4 text-xs md:text-sm max-w-[200px] mx-auto">{negocio?.direccion || 'Cargando...'}</p>
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                <Truck size={12} />
                                <span>Envíos Disponibles</span>
                            </div>
                        </div>

                        {/* Card 3: Hours */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 flex flex-col items-center text-center group">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-[#BE185D] group-hover:bg-[#BE185D] group-hover:text-white transition-colors mb-4 md:mb-6">
                                <Clock size={24} className="md:w-7 md:h-7" />
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">Horario de Atención</h3>
                            <p className="text-gray-500 mb-4 text-xs md:text-sm">Abrimos todos los días</p>
                            <p className="text-[#BE185D] font-bold text-sm md:text-base">7:00 AM - 6:00 PM</p>
                        </div>
                    </div>

                    {/* 3. Main Split Section: Form & Map */}
                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

                        {/* Left: Form */}
                        <div className="lg:w-1/2 p-6 md:p-16 flex flex-col justify-center">
                            <div className="mb-8 md:mb-10">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Envíanos un Mensaje</h2>
                                <p className="text-sm md:text-base text-gray-500">Completa el formulario y te responderemos directamente por WhatsApp para coordinar tu pedido.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full px-5 md:px-6 py-3 md:py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#BE185D] focus:border-transparent outline-none transition-all placeholder-gray-400"
                                        placeholder="Tu nombre aquí"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Celular / WhatsApp</label>
                                    <input
                                        type="tel"
                                        name="celular"
                                        value={formData.celular}
                                        onChange={handleChange}
                                        className="w-full px-5 md:px-6 py-3 md:py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#BE185D] focus:border-transparent outline-none transition-all placeholder-gray-400"
                                        placeholder="999 999 999"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">¿En qué podemos ayudarte?</label>
                                    <textarea
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-5 md:px-6 py-3 md:py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#BE185D] focus:border-transparent outline-none transition-all placeholder-gray-400 resize-none"
                                        placeholder="Escribe tu mensaje..."
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#BE185D] hover:bg-pink-700 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                >
                                    <Send size={20} />
                                    <span>Enviar Mensaje</span>
                                </button>
                                {!negocio && <p className="text-xs text-gray-400 text-center mt-4">Esperando conexión...</p>}
                            </form>
                        </div>

                        {/* Right: Map (Full Height Coverage) */}
                        <div className="lg:w-1/2 relative bg-gray-100 min-h-[400px] lg:min-h-full">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15858.966778465037!2d-79.8596646!3d-6.4269179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x904cf10a30b4d45d%3A0x103d159074744d0!2zVMO6Y3VtZQ!5e0!3m2!1ses!2spe!4v1717010000000!5m2!1ses!2spe"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '100%' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ubicación"
                                className="absolute inset-0 filter grayscale hover:grayscale-0 transition-all duration-700"
                            ></iframe>

                            {/* Overlay Card on Map (Socials) */}
                            <div className="hidden md:block absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50 animate-fade-in-up">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Síguenos en Redes Sociales</p>
                                <div className="flex justify-center gap-6">
                                    {negocio?.enlace_facebook && (
                                        <a href={negocio.enlace_facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#1877F2] text-white rounded-full hover:scale-110 transition-transform shadow-md">
                                            <Facebook size={24} />
                                        </a>
                                    )}
                                    {negocio?.enlace_instagram && (
                                        <a href={negocio.enlace_instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white rounded-full hover:scale-110 transition-transform shadow-md">
                                            <Instagram size={24} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
