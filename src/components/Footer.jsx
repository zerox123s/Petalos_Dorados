import { Link as RouterLink } from 'react-router-dom';
import { Flower, MapPin, Phone, Clock, Mail, ChevronRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SocialIcon from './SocialIcon';

export default function Footer() {
  const { business: negocio, redes, categories } = useCart();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Categorias', path: '/categorias' },
    { name: 'Contáctanos', path: '/contacto' },
  ];

  const footerCategories = categories ? categories.slice(0, 5) : [];

  return (
    <footer className="bg-[#BE185D] text-white pt-10 md:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">

          <div className="col-span-2 lg:col-span-1 space-y-4 md:space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <RouterLink to="/" className="flex items-center gap-3 group w-fit">
              <div className="bg-white/10 p-2.5 rounded-full group-hover:bg-white/20 transition-colors backdrop-blur-sm">
                <Flower size={24} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-['Playfair_Display'] text-2xl font-bold text-white leading-none tracking-tight">
                  {negocio?.nombre_tienda || 'Pétalos Dorados'}
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-pink-200/80 font-medium ml-0.5">
                  Florería
                </span>
              </div>
            </RouterLink>
            <p className="text-pink-100/90 text-sm leading-relaxed max-w-sm">
              Creamos arreglos florales únicos que expresan tus sentimientos más profundos.
            </p>



            <div className="w-full flex flex-col items-center lg:items-start">
              <h4 className="font-bold text-pink-200 text-sm uppercase tracking-wider mb-3">Síguenos</h4>
              <div className="flex gap-4">
                {redes.map(red => (
                  <a
                    key={red.nombre}
                    href={red.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 p-2.5 rounded-full hover:bg-white hover:text-pink-600 hover:-translate-y-1 transition-all duration-300"
                    aria-label={red.nombre}
                  >
                    <SocialIcon name={red.nombre} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-bold text-white mb-4 md:mb-6 relative inline-block">
              Explorar
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-pink-300 rounded-full"></span>
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <RouterLink
                    to={link.path}
                    className="text-pink-100/80 hover:text-white transition-colors flex items-center gap-2 group text-sm md:text-base"
                  >
                    <ChevronRight size={14} className="text-pink-400 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-bold text-white mb-4 md:mb-6 relative inline-block">
              Categorías
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-pink-300 rounded-full"></span>
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {footerCategories.map((cat) => (
                <li key={cat.id}>
                  <RouterLink
                    to={`/categorias#${cat.nombre.toLowerCase().replace(/ /g, '-')}`}
                    className="text-pink-100/80 hover:text-white transition-colors flex items-center gap-2 group text-sm md:text-base"
                  >
                    <ChevronRight size={14} className="text-pink-400 group-hover:translate-x-1 transition-transform" />
                    {cat.nombre}
                  </RouterLink>
                </li>
              ))}
              <li>
                <RouterLink
                  to="/categorias"
                  className="text-white/60 hover:text-white text-xs md:text-sm mt-2 inline-block font-medium border-b border-white/20 hover:border-white transition-all pb-0.5"
                >
                  Ver todas...
                </RouterLink>
              </li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1 mt-4 lg:mt-0">
            <h3 className="text-lg font-bold text-white mb-4 md:mb-6 relative inline-block">
              Contáctanos
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-pink-300 rounded-full"></span>
            </h3>
            <ul className="space-y-3 md:space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-0">
              <li className="flex items-start gap-3 text-pink-100/90">
                <MapPin size={20} className="text-pink-300 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{negocio?.ubicacion || negocio?.direccion || 'Ubicación no disponible'}</span>
              </li>
              <li className="flex items-center gap-3 text-pink-100/90">
                <Phone size={20} className="text-pink-300 flex-shrink-0" />
                <span className="text-sm">{negocio?.celular_whatsapp || negocio?.telefono || 'No disponible'}</span>
              </li>
              <li className="flex items-center gap-3 text-pink-100/90">
                <Truck size={20} className="text-pink-300 flex-shrink-0" />
                <span className="text-sm">Envíos a Chiclayo: Turno Tarde</span>
              </li>
              <li className="flex items-start gap-3 text-pink-100/90 sm:col-span-2 lg:col-span-1">
                <Clock size={20} className="text-pink-300 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p>Todos los días</p>
                  <p className="font-bold">7:00 AM - 6:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-sm text-pink-100/60 text-center">
            © {new Date().getFullYear()} {negocio?.nombre_tienda || 'Florería'}. Todos los derechos reservados.
            <RouterLink to="/acceso-staff-only-x9z2" className="ml-2 text-pink-900/10 hover:text-pink-500/50 cursor-pointer transition-colors" aria-hidden="true">•</RouterLink>
          </p>
        </div>
      </div>
    </footer >
  );
}