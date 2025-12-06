import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const { data: cats } = await supabase.from('categorias').select('*').order('nombre', { ascending: true });
        if (cats) setCategorias(cats);

        const { data: prods } = await supabase.from('productos').select('*, categorias(nombre)').eq('activo', true).order('id', { ascending: false });
        if (prods) setProductos(prods);

      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    cargarDatos();
  }, []);
  
  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div></div>;

  return (
    <div className="font-sans bg-gray-50">
      <Navbar />

      <header className="pt-32 pb-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Nuestras Colecciones</h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Explora cada una de nuestras categorías y encuentra el arreglo perfecto para cada ocasión.</p>
        </div>
      </header>
      
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {categorias.map(categoria => {
            const productosCategoria = productos.filter(p => p.categoria_id === categoria.id);
            if (productosCategoria.length === 0) return null;

            return (
              <section key={categoria.id} id={categoria.nombre.toLowerCase().replace(/ /g, '-')}>
                <div className="relative rounded-2xl overflow-hidden h-64 md:h-72 mb-12 shadow-xl">
                  <img 
                    src={categoria.imagen_url || DEFAULT_CATEGORY_IMAGE} 
                    alt={categoria.nombre} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg">{categoria.nombre}</h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                  {productosCategoria.map(prod => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}