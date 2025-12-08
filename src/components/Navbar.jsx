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
      <div className="hidden md:block bg-[#BE185D] text-white py-2 md:py-3 relative z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs font-medium gap-2 md:gap-0">
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto w-full md:w-auto justify-center md:justify-start pb-1 md:pb-0 scrollbar-hide">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Phone size={13} className="text-pink-200" />
              {negocio?.telefono || '+52 55 1234 5678'}
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <MapPin size={13} className="text-pink-200" />
              {negocio?.direccion || 'Túcume'}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
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

          {/* LOGO & MENU BUTTON GROUP */}
          <div className="flex items-center gap-4">
            {/* MOBILE MENU BUTTON - MOVED TO LEFT */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-[#BE185D] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                <Flower size={20} />
              </div>
              <span className="font-bold text-xl text-gray-800 tracking-tight hidden sm:block group-hover:text-[#BE185D] transition-colors">
                {negocio?.nombre_tienda || 'Pétalos de Oro'}
              </span>
            </Link>
          </div>

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
          </div>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 left-0 z-[70] w-64 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-2 px-6 pt-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-lg font-bold text-gray-800 py-3 border-b border-gray-100 hover:text-pink-600 hover:pl-2 transition-all"
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Social Links (Moved from Top Bar) */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm font-bold text-gray-500 mb-4">Síguenos:</p>
            <div className="flex items-center gap-4">
              {negocio?.enlace_facebook && (
                <a
                  href={negocio.enlace_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                >
                  <Facebook size={20} />
                </a>
              )}
              {negocio?.enlace_instagram && (
                <a
                  href={negocio.enlace_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}