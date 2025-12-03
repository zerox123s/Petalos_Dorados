import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { supabase } from '../supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tiendaNombre, setTiendaNombre] = useState('Mi Florería');
  const location = useLocation();

  // Efecto para cambiar color al hacer scroll
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
    { name: 'Catálogo', path: '/#catalogo' }, // Anchor link
    { name: 'Nosotros', path: '/nosotros' },   // Página real separada
    { name: 'Admin', path: '/login' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-colors ${scrolled ? 'bg-pink-600 text-white' : 'bg-white text-pink-600'}`}>
              {tiendaNombre.charAt(0)}
            </div>
            <span className={`font-bold text-2xl tracking-tight ${scrolled ? 'text-gray-900' : 'text-white drop-shadow-md'}`}>
              {tiendaNombre}
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`font-medium transition hover:text-pink-500 ${scrolled ? 'text-gray-700' : 'text-white drop-shadow-sm'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={scrolled ? 'text-gray-900' : 'text-white'}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-white border-t absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 border-b border-gray-100"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}