import { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Flower, Phone, MapPin, ChevronDown, ChevronRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SocialIcon from './SocialIcon'; // <-- 1. Import SocialIcon

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  // Consume Global Context
  const { cartCount, openCart, business: negocio, categories: categorias, redes } = useCart(); // <-- 2. Consume `redes`
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); // Synchronous instant scroll
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Categorías', path: '/categorias', hasDropdown: true },
    { name: 'Contáctanos', path: '/contacto' },
  ];

  return (
    <>
      {/* TOP BAR */}
      <div className="hidden md:block bg-[#BE185D] text-white py-2 md:py-3 relative z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs font-medium gap-2 md:gap-0">
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto w-full md:w-auto justify-center md:justify-start pb-1 md:pb-0 scrollbar-hide">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Phone size={13} className="text-pink-200" />
              {negocio?.celular_whatsapp || '+51 999 999 999'}
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <MapPin size={13} className="text-pink-200" />
              {negocio?.ubicacion || 'Lambayeque'}
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap px-2 py-0.5 bg-pink-700/50 rounded text-pink-100 border border-pink-600/50 hover:bg-pink-700 transition-colors cursor-help" title="Horario: Tardes">
              <Truck size={13} className="text-pink-200" />
              Envíos a Chiclayo (Tarde)
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-pink-200">Síguenos:</span>
            <div className="flex items-center gap-3">
              {/* 3. Dynamic social links for desktop */}
              {redes.map(red => (
                <a key={red.nombre} href={red.url} target="_blank" rel="noopener noreferrer" aria-label={red.nombre} className="hover:text-pink-200 transition-colors">
                  <SocialIcon name={red.nombre} size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-md py-2 backdrop-blur-md' : 'bg-white py-4 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* LOGO & MENU BUTTON GROUP */}
          {/* MOBILE MENU BUTTON - MOVED TO LEFT */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú principal" : "Abrir menú principal"}
            className="md:hidden w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-pink-50 p-2 rounded-full group-hover:bg-pink-100 transition-colors">
              <Flower size={24} className="text-[#BE185D]" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Playfair_Display'] text-xl md:text-3xl font-bold text-[#BE185D] leading-none tracking-tight group-hover:text-pink-700 transition-colors">
                {negocio?.nombre_tienda || 'Pétalos Dorados'}
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-gray-400 font-medium ml-0.5 group-hover:text-pink-400 transition-colors">
                Florería
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div key={link.name} className="relative group">
                    <Link
                      to={link.path}
                      className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-[#BE185D] transition-colors py-2"
                    >
                      {link.name}
                      <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                    </Link>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                        {categorias.length > 0 ? (
                          categorias.map(cat => (
                            <Link
                              key={cat.id}
                              to={`/categorias#${cat.nombre.toLowerCase().replace(/ /g, '-')}`}
                              className="block px-4 py-3 text-sm text-gray-600 hover:bg-pink-50 hover:text-[#BE185D] transition-colors border-b border-gray-50 last:border-0"
                            >
                              {cat.nombre}
                            </Link>
                          ))
                        ) : (
                          <span className="block px-4 py-3 text-xs text-gray-400">Cargando...</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-bold text-gray-600 hover:text-[#BE185D] transition-colors relative group py-2"
                >
                  {link.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#BE185D] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              );
            })}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            {/* CART ICON */}
            <button
              onClick={openCart}
              aria-label={`Ver carrito de compras con ${cartCount} productos`}
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
      <div className={`fixed top-0 left-0 z-[70] w-72 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-pink-50 p-1.5 rounded-full">
              <Flower size={20} className="text-[#BE185D]" />
            </div>
            <span className="font-['Playfair_Display'] text-lg font-bold text-[#BE185D] leading-none tracking-tight">
              {negocio?.nombre_tienda || 'Pétalos Dorados'}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú principal"
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-2 px-6 pt-2">
          {navLinks.map((link) => {
            if (link.hasDropdown) {
              return (
                <div key={link.name} className="flex flex-col border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between py-3">
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-bold text-gray-800 hover:text-pink-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                    <button
                      onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                      aria-label={mobileCategoriesOpen ? "Cerrar submenú de categorías" : "Abrir submenú de categorías"}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronDown size={20} className={`transform transition-transform duration-300 ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Mobile Submenu */}
                  <div className={`overflow-hidden transition-all duration-300 ${mobileCategoriesOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col gap-2 pl-4 border-l-2 border-pink-100 ml-1">
                      {categorias.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/categorias#${cat.nombre.toLowerCase().replace(/ /g, '-')}`}
                          onClick={() => setIsOpen(false)}
                          className="text-gray-600 py-2 hover:text-[#BE185D] hover:pl-2 transition-all flex items-center gap-2"
                        >
                          <ChevronRight size={14} className="text-pink-400" />
                          {cat.nombre}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-gray-800 py-3 border-b border-gray-100 last:border-0 hover:text-pink-600 hover:pl-2 transition-all"
              >
                {link.name}
              </Link>
            );
          })}

          {/* 4. Dynamic social links for mobile */}
          <div className="mt-8 pt-6">
            <p className="text-sm font-bold text-gray-500 mb-4">Síguenos:</p>
            <div className="flex items-center gap-4">
              {redes.map(red => (
                <a
                  key={red.nombre}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  aria-label={red.nombre}
                >
                  <SocialIcon name={red.nombre} size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}