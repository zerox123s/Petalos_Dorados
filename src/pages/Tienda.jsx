import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import RevealOnScroll from '../components/RevealOnScroll';
import Footer from '../components/Footer';
import { ArrowRight, Sparkles, Flower2 } from 'lucide-react';

const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80';

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const { data: cats } = await supabase.from('categorias').select('*').order('nombre', { ascending: true });
      const { data: prods } = await supabase.from('productos').select('*, categorias(nombre)').eq('activo', true).order('id', { ascending: false });

      if (cats) setCategorias(cats);
      if (prods) setProductos(prods);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  
  const productosDestacados = productos.slice(0, 8);
  const categoriasDestacadas = categorias.slice(0, 4);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div></div>;

  return (
    <div className="font-sans bg-white">
      <Navbar />

      {/* 1. HERO SECTION */}
      <header className="relative w-full lg:min-h-screen bg-gray-50 flex lg:items-center pt-24 md:pt-36 lg:pt-32 pb-12 md:pb-16 lg:pb-20 overflow-hidden">
        <div className="absolute top-1/2 right-0 w-2/3 h-full bg-gradient-to-l from-pink-50/50 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
          <div className="text-center md:text-left relative">
            <RevealOnScroll>
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
                <a href="#destacados" className="w-full sm:w-auto bg-pink-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-pink-200 hover:shadow-xl hover:bg-pink-700 hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                  Ver productos
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </RevealOnScroll>
          </div>
          <div className="relative hidden md:block">
            <RevealOnScroll delay={300}>
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(236,72,153,0.7)] border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-700">
                <img src="https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80" alt="Ramo de flores" className="w-full md:h-[450px] lg:h-[600px] object-cover" />
              </div>
              <div className="absolute -bottom-12 -left-12 w-64 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20 animate-float">
                <img src="https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&q=80" alt="Detalle flores" className="w-full h-full object-cover" />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </header>

      {/* 2. SECCIÓN CATEGORÍAS */}
      <section id="categorias" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Explora las Categorías</h2>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto">Encuentra el regalo perfecto navegando por nuestras colecciones seleccionadas.</p>
              <div className="w-24 h-1.5 bg-pink-600 mx-auto rounded-full mt-6"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {categoriasDestacadas.map(cat => (
                <Link to={`/categorias#${cat.nombre.toLowerCase().replace(/ /g, '-')}`} key={cat.id} className="block group">
                  <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                    <img 
                      src={cat.imagen_url || DEFAULT_CATEGORY_IMAGE}
                      alt={cat.nombre}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex items-end p-6">
                      <h3 className="text-white text-2xl font-bold tracking-tight">{cat.nombre}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {categorias.length > 4 &&
              <div className="text-center mt-12">
                <Link to="/categorias" className="bg-pink-100 text-pink-700 px-10 py-4 rounded-full font-bold hover:bg-pink-200 hover:text-pink-800 transition-all flex items-center justify-center gap-2 group w-fit mx-auto">
                  Ver todas las categorías
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            }
        </div>
      </section>

      {/* 3. PRODUCTOS DESTACADOS */}
      <section id="destacados" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Productos Destacados</h2>
              <div className="w-24 h-1.5 bg-pink-600 mx-auto rounded-full mt-6"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
              {productosDestacados.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <Footer />
    </div>
  );
}