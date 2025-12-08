import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Flower, Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '../supabase';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [negocio, setNegocio] = useState(null);
  const { cartCount, openCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    obtenerNombre();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const obtenerNombre = async () => {
    const { data } = await supabase.from('negocio').select('*').single();
    if (data) {
      setNegocio(data);
    }
  };

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Categorías', path: '/categorias' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-[#BE185D] text-white py-3 hidden md:block relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone size={14} className="text-pink-200" />
              {negocio?.telefono || '+52 55 1234 5678'}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-pink-200" />
              {negocio?.direccion || 'Túcume'}
            </span>
            <a href={`mailto:${negocio?.email || 'contacto@petalosdorados.com'}`} className="flex items-center gap-2 hover:text-pink-200 transition-colors" title="Enviar correo">
              <Mail size={14} className="text-pink-200" />
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-pink-200">Síguenos:</span>
            <div className="flex items-center gap-3">
              {negocio?.enlace_facebook && (
                <a href={negocio.enlace_facebook} target="_blank" rel="noopener noreferrer" className="hover:text-pink-200 transition-colors">
                  <Facebook size={14} />
                </a>
              )}
              {negocio?.enlace_instagram && (
                <a href={negocio.enlace_instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-200 transition-colors">
                  <Instagram size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-md py-2 backdrop-blur-md' : 'bg-white py-4 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-[#BE185D] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
              <Flower size={20} />
            </div>
            <span className="font-bold text-xl text-gray-800 tracking-tight hidden sm:block group-hover:text-[#BE185D] transition-colors">
              {negocio?.nombre_tienda || 'Pétalos de Oro'}
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-bold text-gray-600 hover:text-[#BE185D] transition-colors relative group py-2"
              >
                {link.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#BE185D] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            {/* CART ICON */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 rounded-full bg-pink-50 hover:bg-pink-100 text-[#BE185D] flex items-center justify-center transition-all hover:scale-105 group border border-pink-100"
            >
              <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#BE185D] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-32 px-6 md:hidden animate-fade-in">
          <div className="flex flex-col gap-4 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-xl font-bold text-gray-800 py-4 border-b border-gray-100 hover:text-pink-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}