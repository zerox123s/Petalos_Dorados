import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';

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
    <div className="font-sans bg-white">
      <Navbar />

      {/* 1. HERO SECTION (PANTALLA COMPLETA) */}
      <header className="relative w-full h-screen">
        <img
          src="https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&q=80"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <span className="text-pink-300 font-medium tracking-widest uppercase mb-4 animate-fade-in-up">Nueva Colección</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-xl max-w-4xl leading-tight">
            {negocio?.nombre_tienda || "Flores que Enamoran"}
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl font-light">
            Diseños exclusivos para momentos inolvidables. Envía amor, envía vida.
          </p>
          <a href="#catalogo" className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-pink-600 hover:text-white transition-all transform hover:scale-105 shadow-xl flex items-center gap-2">
            Ver Catálogo <ArrowRight size={20} />
          </a>
        </div>
      </header>

      {/* 2. CATÁLOGO (ANCHO COMPLETO CON MAX-WIDTH) */}
      <section id="catalogo" className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-3 font-serif">Nuestros Arreglos</h2>
            <div className="w-24 h-1.5 bg-pink-600 mx-auto rounded-full mb-10"></div>

            {/* Category Filters - Premium Design */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setCategoriaActiva('Todas')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${categoriaActiva === 'Todas'
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
                  className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${categoriaActiva === cat.nombre
                      ? 'bg-pink-600 text-white shadow-lg shadow-pink-200 transform scale-105'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-pink-600 hover:text-pink-600 shadow-sm'
                    }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productosFiltrados.map((prod) => (
              <ProductCard key={prod.id} product={prod} negocio={negocio} />
            ))}
          </div>

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