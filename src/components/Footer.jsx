import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Flower, Heart } from 'lucide-react';

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
    { name: 'Contacto', path: '/#contacto' },
  ];



  return (
    <footer className="bg-[#BE185D] text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Columna 1: Logo y Marca */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pink-600">
                <Flower size={20} />
              </div>
              <span className="font-bold text-xl text-white tracking-tight group-hover:text-pink-200 transition-colors">
                {negocio?.nombre_tienda || 'Florería'}
              </span>
            </Link>
            <p className="mt-4 text-sm text-pink-100/90 max-w-xs leading-relaxed">
              Diseños florales que alegran el corazón y acompañan tus momentos más especiales con frescura y elegancia.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h3 className="text-sm font-bold text-pink-200 tracking-wider uppercase mb-6">Navegación</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-base text-pink-100/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h3 className="text-sm font-bold text-pink-200 tracking-wider uppercase mb-6">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-base text-pink-100/80 hover:text-white hover:translate-x-1 transition-all inline-block">Términos y Condiciones</a></li>
              <li><a href="#" className="text-base text-pink-100/80 hover:text-white hover:translate-x-1 transition-all inline-block">Política de Privacidad</a></li>
              <li><a href="#" className="text-base text-pink-100/80 hover:text-white hover:translate-x-1 transition-all inline-block">Política de Envíos</a></li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h3 className="text-sm font-bold text-pink-200 tracking-wider uppercase mb-6">Síguenos</h3>
            <div className="flex space-x-4">
              {negocio?.enlace_facebook && (
                <a href={negocio.enlace_facebook} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-white hover:text-pink-600 transition-all group">
                  <span className="sr-only">Facebook</span>
                  <Facebook size={20} />
                </a>
              )}
              {negocio?.enlace_instagram && (
                <a href={negocio.enlace_instagram} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-white hover:text-pink-600 transition-all group">
                  <span className="sr-only">Instagram</span>
                  <Instagram size={20} />
                </a>
              )}
            </div>
          </div>
        </div>



        {/* Features Bar (Moved to bottom) */}


        {/* Copyright */}
        <div className="mt-6 border-t border-white/10 pt-6 flex justify-center items-center">
          <p className="text-sm text-pink-100/60 text-center">
            © {new Date().getFullYear()} {negocio?.nombre_tienda || 'Florería'}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer >
  );
}