import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Flower } from 'lucide-react';
import { supabase } from '../supabase';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tiendaNombre, setTiendaNombre] = useState('Pétalos de Oro');
  const { cartCount, openCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    obtenerNombre();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const obtenerNombre = async () => {
    const { data } = await supabase.from('negocio').select('nombre_tienda').single();
    if (data) setTiendaNombre(data.nombre_tienda);
  };

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Colección', path: '/#catalogo' },
    { name: 'Eventos', path: '/eventos' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-center md:px-4 transition-all duration-500 ${scrolled ? 'md:pt-2' : 'md:pt-6'}`}>
        <div className={`bg-white/90 backdrop-blur-md md:rounded-3xl shadow-sm md:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-b md:border border-white/50 px-6 flex items-center justify-between w-full md:max-w-6xl transition-all duration-300 ${scrolled ? 'py-3 md:py-2.5' : 'py-4'}`}>

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white shadow-md shadow-pink-200 group-hover:scale-105 transition-transform duration-300">
              <Flower size={20} />
            </div>
            <span className="font-bold text-xl text-gray-800 tracking-tight hidden sm:block group-hover:text-pink-600 transition-colors">
              {tiendaNombre}
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-5 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            {/* CART ICON */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 flex items-center justify-center transition-all hover:scale-105 group"
            >
              <ShoppingCart size={18} className="group-hover:rotate-12 transition-transform duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
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