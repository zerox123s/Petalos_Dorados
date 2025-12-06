import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Flower } from 'lucide-react';

export default function Footer() {
  const [negocio, setNegocio] = useState(null);

  useEffect(() => {
    const cargarDatosNegocio = async () => {
      const { data } = await supabase.from('negocio').select('*').single();
      if (data) setNegocio(data);
    };
    cargarDatosNegocio();
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Colección', path: '/categorias' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Contacto', path: '/#contacto' }, // Asumiendo que tienes una sección de contacto
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Logo y Marca */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white">
                <Flower size={20} />
              </div>
              <span className="font-bold text-xl text-white tracking-tight group-hover:text-pink-400 transition-colors">
                {negocio?.nombre_tienda || 'Florería'}
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              Diseños florales que alegran el corazón y acompañan tus momentos.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Navegación</h3>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-base text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Legal (Ejemplo) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Términos y Condiciones</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Política de Privacidad</a></li>
              <li><a href="#" className="text-base text-gray-400 hover:text-white">Política de Envíos</a></li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Síguenos</h3>
            <div className="mt-4 flex space-x-5">
              {negocio?.enlace_facebook && (
                <a href={negocio.enlace_facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <Facebook size={24} />
                </a>
              )}
              {negocio?.enlace_instagram && (
                <a href={negocio.enlace_instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <Instagram size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} {negocio?.nombre_tienda || 'Florería'}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}