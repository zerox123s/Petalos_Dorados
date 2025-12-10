import { useState, useLayoutEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import ProductDetailModal from '../components/ProductDetailModal';

const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80';

const CATEGORY_DESCRIPTIONS = {
  'arreglo-flores': 'Diseños florales únicos para embellecer cualquier espacio con frescura y elegancia.',
  'ramos': 'La expresión clásica del amor y la alegría en cada tallo, perfectos para regalar.',
  'cajas': 'Elegancia y sorpresa contenidas en hermosas presentaciones listas para impresionar.',
  'funebres': 'Arreglos respetuosos y solemnes para honrar la memoria de tus seres queridos.',
  'default': 'Explora nuestra exclusiva selección de esta categoría.'
};

export default function Categorias() {
  // Consume Global Context
  const { categories: categorias, products: productos, isShopLoading: loading } = useCart();

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();

  // Instant Scroll on Hash Change (Filter)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.hash]);

  // Filter Logic
  const activeHash = location.hash.replace('#', '');
  const displayedCategorias = activeHash
    ? categorias.filter(cat => cat.nombre.toLowerCase().replace(/ /g, '-') === activeHash)
    : categorias;

  const currentCategory = activeHash && displayedCategorias.length > 0 ? displayedCategorias[0] : null;
  const description = activeHash
    ? (CATEGORY_DESCRIPTIONS[activeHash] || CATEGORY_DESCRIPTIONS['default'])
    : "Explora cada una de nuestras categorías y encuentra el arreglo perfecto para cada ocasión.";

  // Modal Handlers
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div></div>;

  return (
    <div className="font-sans bg-gray-50">
      <Navbar />

      <header className="pt-10 md:pt-[4rem] pb-4 md:pb-6 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900">
            Nuestras Colecciones
          </h1>
          <div className="w-16 md:w-24 h-1 md:h-1.5 bg-pink-600 mx-auto rounded-full my-1 md:my-3"></div>
          <p className="mt-0.5 md:mt-2 text-sm md:text-lg text-gray-500 max-w-2xl mx-auto leading-tight">
            {description}
          </p>
        </div>
      </header>

      <main className="pt-2 pb-10 md:py-12 min-h-[50vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {displayedCategorias.length > 0 ? (
            displayedCategorias.map(categoria => {
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
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onClick={() => handleProductClick(prod)}
                      />
                    ))}
                  </div>
                </section>
              )
            })
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">Categoría no encontrada.</p>
              <Link to="/categorias" className="text-pink-600 font-bold hover:underline mt-4 inline-block">Ver todas</Link>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}