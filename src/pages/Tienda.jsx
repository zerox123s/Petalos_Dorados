import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import RevealOnScroll from '../components/RevealOnScroll';
import Footer from '../components/Footer';
import { ArrowRight, Sparkles, Flower2, ChevronLeft, ChevronRight, Clock, Heart } from 'lucide-react';

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

  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerPage(2); // Mobile: 2 items
      else if (window.innerWidth < 1024) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Duplicate categories to create infinite scroll effect
  // Duplicate categories to create infinite scroll effect
  const extendedCategorias = [...categorias, ...categorias, ...categorias, ...categorias];

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  const nextSlide = () => {
    setCurrentSlide(prev => {
      // Loop back only if significantly far
      if (prev + 1 >= extendedCategorias.length - itemsPerPage) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentSlide(prev =>
      prev === 0 ? extendedCategorias.length - itemsPerPage - 1 : prev - 1
    );
  };

  // Calculate current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(productos.length / productsPerPage);

  // Custom smooth scroll function
  const smoothScrollTo = (targetPosition, duration) => {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    const easeInOutQuad = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
  };

  // Scroll to section top whenever page changes
  useEffect(() => {
    if (currentPage > 1 || (currentPage === 1 && window.scrollY > 0)) {
      const section = document.getElementById('destacados');
      if (section) {
        const yOffset = -80; // Offset for sticky navbar
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
        smoothScrollTo(y, 300); // 300ms duration for snappy speed
      }
    }
  }, [currentPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div></div>;

  return (
    <div className="font-sans bg-gray-50">
      <Navbar />

      {/* 1. HERO SECTION */}
      <header className="relative w-full lg:min-h-screen bg-gray-50 flex lg:items-center pt-1 md:pt-6 lg:pt-10 pb-12 md:pb-16 lg:pb-20 overflow-hidden">
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
              {/* Features Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-8 relative z-10 w-full max-w-lg">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 p-1 sm:p-3 rounded-xl hover:bg-white/50 transition-colors">
                  <div className="p-2 bg-pink-100/50 rounded-lg text-pink-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Entrega Rápida</h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">Mismo día disponible</p>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 p-1 sm:p-3 rounded-xl hover:bg-white/50 transition-colors">
                  <div className="p-2 bg-pink-100/50 rounded-lg text-pink-600">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">100% Frescas</h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">Garantía de calidad</p>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 p-1 sm:p-3 rounded-xl hover:bg-white/50 transition-colors col-span-2 sm:col-span-1 w-1/2 sm:w-auto mx-auto sm:mx-0">
                  <div className="p-2 bg-pink-100/50 rounded-lg text-pink-600">
                    <Heart size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">Hecho con Amor</h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">Arreglos únicos</p>
                  </div>
                </div>
              </div>

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
      <section id="categorias" className="py-8 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <RevealOnScroll variant="left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Explora las Categorías</h2>
              <div className="w-24 h-1.5 bg-pink-600 mx-auto rounded-full mt-6"></div>
            </RevealOnScroll>
          </div>
          {/* Carousel Container */}
          {/* Carousel Container */}
          <div
            className="relative group"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Side Navigation Arrows (Small & Discrete) */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/90 shadow-md text-pink-600 hover:bg-pink-50 hover:scale-105 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-white/90 shadow-md text-pink-600 hover:bg-pink-50 hover:scale-105 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
            <div className="overflow-hidden py-4 -my-4">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * (100 / itemsPerPage)}%)` }}
              >
                {extendedCategorias.map((cat, index) => (
                  <div
                    key={`${cat.id}-${index}`}
                    className="flex-shrink-0 px-3"
                    style={{ width: `${100 / itemsPerPage}%` }}
                  >
                    <RevealOnScroll delay={index * 100}>
                      <Link to={`/categorias#${cat.nombre.toLowerCase().replace(/ /g, '-')}`} className="block group/card h-full">
                        <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 shadow-lg group-hover/card:shadow-2xl transition-all duration-500">
                          <img
                            src={cat.imagen_url || DEFAULT_CATEGORY_IMAGE}
                            alt={cat.nombre}
                            className="w-full h-full object-cover transform group-hover/card:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover/card:bg-opacity-50 transition-all duration-300 flex items-end p-6">
                            <h3 className="text-white text-2xl font-bold tracking-tight">{cat.nombre}</h3>
                          </div>
                        </div>
                      </Link>
                    </RevealOnScroll>
                  </div>
                ))}
              </div>
            </div>
            {/* View All Categories Button */}
            {categorias.length > itemsPerPage && (
              <div className="text-center mt-8">
                <Link to="/categorias" className="inline-flex items-center justify-center gap-2 bg-pink-700 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-100 hover:text-pink-800 transition-all group shadow-sm hover:shadow-md">
                  Ver todas las categorías
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. PRODUCTOS DESTACADOS */}
      <section id="destacados" className="pt-4 pb-8 md:pt-10 md:pb-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <RevealOnScroll variant="left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Descubre Nuestros Productos</h2>
              <div className="w-24 h-1.5 bg-pink-600 mx-auto rounded-full mt-6"></div>
            </RevealOnScroll>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 mb-12">
            {currentProducts.map((prod, index) => (
              <RevealOnScroll key={prod.id} delay={index * 100}>
                <ProductCard product={prod} />
              </RevealOnScroll>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50 hover:border-pink-300 shadow-sm'} transition-all`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-pink-600 text-white shadow-md scale-110' : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-600'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50 hover:border-pink-300 shadow-sm'} transition-all`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. FOOTER */}
      <Footer />
    </div>
  );
}