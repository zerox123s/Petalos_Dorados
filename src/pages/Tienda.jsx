import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import RevealOnScroll from '../components/RevealOnScroll';
import { ArrowRight, Sparkles, Flower2, Leaf, Sprout } from 'lucide-react';

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [negocio, setNegocio] = useState(null);
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const { data: neg } = await supabase.from('negocio').select('*').single();
      const { data: cats } = await supabase.from('categorias').select('*').order('nombre', { ascending: true });
      const { data: prods } = await supabase.from('productos').select('*, categorias(nombre)').order('id', { ascending: false });

      if (neg) setNegocio(neg);
      if (cats) setCategorias(cats);
      if (prods) setProductos(prods);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const productosFiltrados = categoriaActiva === 'Todas'
    ? productos
    : productos.filter(p => p.categorias?.nombre === categoriaActiva);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div></div>;

  return (
    <div className="font-sans bg-gray-50">
      <Navbar />

      {/* 1. HERO SECTION (NUEVO DISEÑO) */}
      <header className="relative w-full lg:min-h-screen bg-gray-50 flex lg:items-center pt-24 md:pt-36 lg:pt-32 pb-12 md:pb-16 lg:pb-20 overflow-hidden">

        {/* Background Decoration - Subtle Glows only */}
        <div className="absolute top-1/2 right-0 w-2/3 h-full bg-gradient-to-l from-pink-50/50 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">

          {/* Left Column: Text */}
          <div className="text-center md:text-left relative">
            <div className="hidden md:block absolute bottom-[25rem] left-5 text-red-600 animate-bounce md:bottom-[25.2rem]" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>
              <Flower2 size={42} strokeWidth={1.5} />
            </div>

            <RevealOnScroll>
              {/* Mobile Hero Image */}
              <div className="block md:hidden mb-6 mx-auto w-full max-w-sm relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80"
                  alt="Ramo de flores vibrante"
                  className="w-full h-[280px] object-cover rounded-[2.5rem] border-4 border-white shadow-2xl"
                />
              </div>

              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-5 py-2 rounded-full text-sm font-bold mb-6 md:mb-8 border border-pink-100 animate-fade-in-up">
                <Sparkles size={16} className="text-pink-700" />
                Entrega el mismo día
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-sans text-gray-900 leading-tight mb-6 md:mb-8 relative z-10">
                Flores que <span className="text-pink-500">acompañan</span>
              </h1>

              <p className="text-lg text-gray-500 mb-8 md:mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium relative z-10">
                Creamos arreglos florales que llenan tus momentos especiales de color, frescura y emociones reales.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 relative z-10">
                <a href="#catalogo" className="w-full sm:w-auto bg-pink-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-pink-200 hover:shadow-xl hover:bg-pink-700 hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                  Explorar colección
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Column: Images */}
          <div className="relative hidden md:block">
            <RevealOnScroll delay={300}>
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(236,72,153,0.7)] border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-700">
                <img
                  src="https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80"
                  alt="Ramo de flores vibrante"
                  className="w-full md:h-[450px] lg:h-[600px] object-cover"
                />
              </div>

              {/* Floating Image */}
              <div className="absolute -bottom-12 -left-12 w-64 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20 animate-float">
                <img
                  src="https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&q=80"
                  alt="Detalle flores"
                  className="w-full h-full object-cover"
                />
              </div>
            </RevealOnScroll>
          </div>

        </div>
      </header>

      {/* 2. CATÁLOGO (ANCHO COMPLETO CON MAX-WIDTH) */}
      <section id="catalogo" className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-serif">Nuestros Arreglos</h2>
              <div className="w-24 h-1.5 bg-pink-600 mx-auto rounded-full mb-10"></div>

              {/* Category Filters - Premium Design */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setCategoriaActiva('Todas')}
                  className={`px-5 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${categoriaActiva === 'Todas'
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-200 transform scale-105'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-pink-600 hover:text-pink-600 shadow-sm'
                    }`}
                >
                  Todas
                </button>
                {categorias.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaActiva(cat.nombre)}
                    className={`px-5 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${categoriaActiva === cat.nombre
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-200 transform scale-105'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-pink-600 hover:text-pink-600 shadow-sm'
                      }`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
              {productosFiltrados.map((prod) => (
                <ProductCard key={prod.id} product={prod} negocio={negocio} />
              ))}
            </div>
          </RevealOnScroll>

          {productosFiltrados.length === 0 && (
            <div className="text-center py-20 text-gray-400">No hay productos en esta categoría.</div>
          )}

        </div>
      </section>

      {/* 3. FOOTER */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">{negocio?.nombre_tienda}</h2>
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}