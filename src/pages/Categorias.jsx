import { useState, useLayoutEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import ProductDetailModal from '../components/ProductDetailModal';
import Breadcrumbs from '../components/Breadcrumbs';
import { getOptimizedCloudinaryUrl, getOptimizedUnsplashUrl } from '../utils/image';

const DEFAULT_CATEGORY_IMAGE = '';

const CATEGORY_DESCRIPTIONS = {
  'arreglo-flores': 'Diseños florales únicos para embellecer cualquier espacio con frescura y elegancia.',
  'ramos': 'La expresión clásica del amor y la alegría en cada tallo, perfectos para regalar.',
  'cajas': 'Elegancia y sorpresa contenidas en hermosas presentaciones listas para impresionar.',
  'funebres': 'Arreglos respetuosos y solemnes para honrar la memoria de tus seres queridos.',
  'default': 'Explora nuestra exclusiva selección de esta categoría.'
};

const CategoryOverviewCard = ({ category }) => {
  const categoryHash = category.nombre.toLowerCase().replace(/ /g, '-');
  const imageUrl = getOptimizedCloudinaryUrl(category.imagen_url, { width: 500 }) || DEFAULT_CATEGORY_IMAGE;

  return (
    <Link to={`/categorias#${categoryHash}`} className="block group">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-transparent hover:border-pink-200">
        <div className="relative h-56 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={category.nombre}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <span className="text-gray-300 text-4xl">🌸</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>
        <div className="p-5 text-center">
          <h3 className="text-xl font-bold text-gray-800 transition-colors">
            {category.nombre}
          </h3>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2 h-10">
            {CATEGORY_DESCRIPTIONS[categoryHash] || CATEGORY_DESCRIPTIONS['default']}
          </p>
          <div className="mt-4">
            <span className="inline-block text-pink-600 font-semibold text-sm group-hover:underline">
              Ver productos &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function Categorias() {
  const { categories: categorias, products: productos, isShopLoading: loading } = useCart();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.hash]);

  const activeHash = location.hash.replace('#', '');
  const displayedCategorias = activeHash
    ? categorias.filter(cat => cat.nombre.toLowerCase().replace(/ /g, '-') === activeHash)
    : categorias;

  const currentCategory = activeHash && displayedCategorias.length > 0 ? displayedCategorias[0] : null;
  const title = currentCategory ? currentCategory.nombre : "Nuestras Colecciones";
  const description = activeHash
    ? (CATEGORY_DESCRIPTIONS[activeHash] || CATEGORY_DESCRIPTIONS['default'])
    : "Explora cada una de nuestras categorías y encuentra el arreglo perfecto para cada ocasión.";

  const crumbs = [
    { label: 'Inicio', link: '/' },
    { label: 'Categorías', link: currentCategory ? '/categorias' : null },
  ];
  if (currentCategory) {
    crumbs.push({ label: currentCategory.nombre, link: null });
  }

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
      <Breadcrumbs crumbs={crumbs} />

      <header className="pt-8 md:pt-10 pb-4 md:pb-6 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900">
            {title}
          </h1>
          <div className="w-16 md:w-24 h-1 md:h-1.5 bg-pink-600 mx-auto rounded-full my-1 md:my-3"></div>
          <p className="mt-0.5 md:mt-2 text-sm md:text-lg text-gray-500 max-w-2xl mx-auto leading-tight">
            {description}
          </p>
        </div>
      </header>

      <main className="pb-10 md:pb-20 min-h-[50vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {!activeHash ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categorias.map(categoria => (
                <CategoryOverviewCard key={categoria.id} category={categoria} />
              ))}
            </div>
          ) : displayedCategorias.length > 0 ? (
            <div className="space-y-12">
              {displayedCategorias.map(categoria => {
                const productosCategoria = productos.filter(p => p.categoria_id === categoria.id);
                if (productosCategoria.length === 0) return (
                  <div key={categoria.id} className="text-center py-10">
                    <p className="text-gray-500 text-lg">No hay productos en esta categoría aún.</p>
                  </div>
                );

                return (
                  <section key={categoria.id} id={categoria.nombre.toLowerCase().replace(/ /g, '-')}>
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
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">Categoría no encontrada.</p>
              <Link to="/categorias" className="text-pink-600 font-bold hover:underline mt-4 inline-block">Ver todas</Link>
            </div>
          )}
        </div>
      </main>

      <Footer />



      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}