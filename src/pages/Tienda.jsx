import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import { ShoppingCart, ArrowRight } from 'lucide-react';

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

  const pedirWsp = (prod) => {
    if(!prod.activo) return;
    const msg = `${negocio?.mensaje_pedidos || 'Hola:'} ${prod.nombre}`;
    window.open(`https://wa.me/${negocio?.celular_whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

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
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Nuestros Arreglos</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setCategoriaActiva('Todas')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition ${categoriaActiva === 'Todas' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:text-pink-600'}`}
              >
                Todas
              </button>
              {categorias.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setCategoriaActiva(cat.nombre)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition ${categoriaActiva === cat.nombre ? 'bg-pink-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:text-pink-600'}`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productosFiltrados.map((prod) => (
              <div key={prod.id} className="group bg-white rounded-none md:rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300">
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                  <img 
                    src={prod.imagen_url || 'https://via.placeholder.com/400'} 
                    alt={prod.nombre} 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!prod.activo && 'grayscale'}`}
                  />
                  {!prod.activo && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold border-2 border-white px-4 py-2 uppercase tracking-widest">Agotado</span>
                    </div>
                  )}
                  {prod.activo && (
                    <button 
                      onClick={() => pedirWsp(prod)}
                      className="absolute bottom-4 left-4 right-4 bg-white text-gray-900 py-3 font-bold uppercase text-xs tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300 shadow-lg flex justify-center gap-2 items-center hover:bg-green-500 hover:text-white"
                    >
                      Pedir por WhatsApp
                    </button>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs text-pink-500 font-bold uppercase mb-1">{prod.categorias?.nombre}</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{prod.nombre}</h3>
                  <div className="flex justify-between items-end">
                    <p className={`text-xl font-serif ${!prod.activo ? 'line-through text-gray-300' : 'text-gray-900'}`}>
                      S/. {prod.precio}
                    </p>
                  </div>
                </div>
              </div>
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