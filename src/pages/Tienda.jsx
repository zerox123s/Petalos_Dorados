import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import RevealOnScroll from '../components/RevealOnScroll';

import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Gift, Sparkles, Flower2, ChevronLeft, ChevronRight, Clock, Heart, ArrowRight } from 'lucide-react';
import { getOptimizedCloudinaryUrl, getOptimizedUnsplashUrl } from '../utils/image';

const DEFAULT_CATEGORY_IMAGE = '';

// Variable de módulo para controlar el reset solo una vez por carga de página (F5)
let hasCheckedReload = false;

export default function Tienda() {
  const { products: productos, categories: categorias, isShopLoading: loading } = useCart();


  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const heroImages = [
    "/banner/rosasGlobo.webp",
    "/banner/rosasOso.webp",
    "/banner/rosas2.webp",
  ];

  /* 
   * LÓGICA DE DETECCIÓN DE RECARGA (F5)
   * Se ejecuta al montar el componente. Si detectamos que es un reload real del navegador
   * y no lo hemos procesado aún, limpiamos el storage para reiniciar la vista.
   */
  if (!hasCheckedReload) {
    const navEntry = performance.getEntriesByType("navigation")[0];
    if (navEntry && navEntry.type === 'reload') {
      // Es un F5 -> Limpiar estado persistido para iniciar de fresco
      sessionStorage.removeItem('tienda_visibleCount');
      sessionStorage.removeItem('tienda_productOrder');
    }
    hasCheckedReload = true; // Marcar como revisado para que navegaciones futuras (Atrás/Adelante) no reseteen
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  /* 
   * INICIO: Lógica para persistir la cantidad de productos vistos "Ver más"
   * Esto permite que al regresar de un producto, la lista mantenga su tamaño previo.
   */
  const [visibleCount, setVisibleCount] = useState(() => {
    const savedCount = sessionStorage.getItem('tienda_visibleCount');
    return savedCount ? parseInt(savedCount, 10) : 8;
  });

  /*
   * Capturamos el conteo inicial restaurado para saber qué productos 
   * deben aparecer INSTANTÁNEAMENTE (sin animación) porque ya fueron vistos.
   */
  const [initialRestoredCount] = useState(() => {
    const savedCount = sessionStorage.getItem('tienda_visibleCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem('tienda_visibleCount', visibleCount.toString());
  }, [visibleCount]);
  /* FIN: Lógica de persistencia de cantidad */

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  /* 
   * INICIO: Lógica para persistir el ORDEN ALEATORIO de los productos
   * Esto evita que al volver, los productos cambien de lugar.
   */
  const shuffledProducts = useMemo(() => {
    if (!productos || productos.length === 0) return [];

    // Intentar recuperar el orden guardado (la variable de módulo ya se encargó de limpiar si era necesario)
    const savedOrder = sessionStorage.getItem('tienda_productOrder');

    if (savedOrder) {
      try {
        const orderIds = JSON.parse(savedOrder);
        // Reconstruir el array de productos en el orden guardado
        // Filtramos por si algún producto fue eliminado de la DB pero sigue en storage
        const ordered = orderIds
          .map(id => productos.find(p => p.id === id))
          .filter(Boolean);

        // Si la longitud coincide (o es razonable), usamos el orden guardado
        // Si hay una discrepancia grande (nuevos productos), podríamos decidir remezclar,
        // pero para UX consistente, mejor mantener lo guardado y añadir lo nuevo al final si fuera necesario.
        // Aquí simplificamos usando lo guardado si existe validamente.
        if (ordered.length > 0) return ordered;
      } catch (e) {
        console.error("Error parsing saved product order", e);
      }
    }

    // Si no hay orden guardado, generar uno nuevo aleatorio
    const newShuffled = [...productos].sort(() => 0.5 - Math.random());

    // Guardar los IDs del nuevo orden
    const newOrderIds = newShuffled.map(p => p.id);
    sessionStorage.setItem('tienda_productOrder', JSON.stringify(newOrderIds));

    return newShuffled;
  }, [productos]);
  /* FIN: Lógica de persistencia de orden */

  const currentProducts = shuffledProducts.slice(0, visibleCount);

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

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center mb-8 animate-pulse">
        <p className="text-gray-400 text-xs md:text-sm tracking-[0.5em] uppercase mb-2 font-['Playfair_Display'] italic">Florería</p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 tracking-tight font-['Playfair_Display']">Pétalos Dorados</h2>
      </div>
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-100 border-t-pink-600"></div>
    </div>
  );

  return (
    <div className="font-sans bg-gray-50">
      <SEO
        title="Tienda de Flores"
        description="Florería Pétalos Dorados en Túcume, Lambayeque. Arreglos florales para cumpleaños, aniversarios, bodas y eventos especiales. Entrega el mismo día en Chiclayo y alrededores."
      />
      <Navbar />

      <header className="relative w-full lg:min-h-screen bg-gray-50 flex lg:items-center pt-8 md:pt-6 lg:pt-10 pb-12 md:pb-16 lg:pb-20 overflow-hidden">

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
          <div className="text-center md:text-left relative">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-5 py-2 rounded-full text-sm font-bold mb-6 md:mb-8 border border-pink-100 animate-fade-in-up">
              <Sparkles size={16} className="text-pink-700" />
              Entrega el mismo día
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-sans text-gray-900 leading-tight mb-4 md:mb-6 relative z-10 drop-shadow-md">
              Flores que <span className="text-pink-500">acompañan</span>
            </h1>
            <p className="block md:hidden text-lg text-gray-600 mb-6 font-medium relative z-10">
              Transformamos emociones en flores.
            </p>
            <p className="hidden md:block text-lg text-gray-500 mb-3 md:mb-5 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium relative z-10">
              Cada uno de nuestros arreglos está pensado para acompañar tus momentos especiales con elegancia y frescura.
            </p>

            <div className="block md:hidden relative z-10 mb-8 flex flex-col items-center">
              <div className="relative rounded-[1.5rem] overflow-hidden shadow-lg border-4 border-white transform -rotate-2 w-64 h-64 bg-gray-100">
                {heroImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Flores en exhibición"
                    fetchPriority={index === 0 ? 'high' : 'low'}
                    className={`absolute inset-0 w-full h-full object-cover rounded-[1.2rem] transition-opacity duration-[1500ms] ease-in-out ${currentHeroSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  />
                ))}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentHeroSlide(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${currentHeroSlide === index ? 'bg-gray-50 w-3' : 'bg-gray-50'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 relative z-10">
              <a href="#destacados" className="w-full sm:w-auto bg-pink-600 text-white px-6 md:px-10 py-4 rounded-full font-bold shadow-[0_20px_40px_-5px_rgba(236,72,153,0.3)] hover:shadow-[0_25px_50px_-5px_rgba(236,72,153,0.5)] hover:bg-pink-700 hover:scale-105 transition-all flex items-center justify-center gap-2 group text-sm md:text-base">
                Ver productos
                <Gift size={20} className="group-hover:rotate-12 transition-transform flex-shrink-0" />
              </a>
            </div>
          </div>

          <div className="relative hidden md:block">
            <RevealOnScroll delay={300}>
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(236,72,153,0.7)] border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-700 w-full md:h-[450px] lg:h-[600px] bg-gray-50">
                {heroImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Flores en exhibición"
                    fetchPriority={index === 0 ? 'high' : 'low'}
                    className={`absolute inset-0 w-full h-full object-cover rounded-[2rem] transition-opacity duration-[1500ms] ease-in-out ${currentHeroSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  />
                ))}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentHeroSlide(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all backdrop-blur-sm shadow-sm ${currentHeroSlide === index ? 'bg-gray-50 w-6' : 'bg-gray-50/50 hover:bg-gray-50/80'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-12 -left-12 w-64 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20 animate-float">
                <img src="/banner/gira.webp" alt="Detalle flores" className="w-full h-full object-cover" />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </header>

      <section id="categorias" className="scroll-mt-40 py-8 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Explora las Categorías</h2>
            <div className="w-24 h-1.5 bg-pink-600 mx-auto rounded-full mt-6"></div>
          </div>
          <div
            className="relative group"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
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
                    <Link to={`/categorias#${cat.nombre.toLowerCase().replace(/ /g, '-')}`} className="block group/card h-full">
                      <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 shadow-lg group-hover/card:shadow-2xl transition-all duration-500 bg-gray-100 flex items-center justify-center">
                        {getOptimizedCloudinaryUrl(cat.imagen_url, { width: 400 }) ? (
                          <img
                            src={getOptimizedCloudinaryUrl(cat.imagen_url, { width: 400 })}
                            alt={cat.nombre}
                            className="w-full h-full object-cover transform group-hover/card:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <span className="text-gray-300 text-6xl">🌸</span>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover/card:bg-opacity-50 transition-all duration-300 flex items-end p-6">
                          <h3 className="text-white text-2xl font-bold tracking-tight">{cat.nombre}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-8">
              <Link to="/categorias" className="inline-flex items-center justify-center gap-2 bg-pink-600 text-white px-6 md:px-10 py-4 rounded-full font-bold shadow-[0_20px_40px_-5px_rgba(236,72,153,0.3)] hover:shadow-[0_25px_50px_-5px_rgba(236,72,153,0.5)] hover:bg-pink-700 hover:scale-105 transition-all group w-full sm:w-auto text-sm md:text-base">
                Explorar todas las categorías
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="destacados" className="scroll-mt-40 pt-4 pb-4 md:pt-10 md:pb-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Descubre Nuestros Productos</h2>
            <div className="w-24 h-1.5 bg-pink-600 mx-auto rounded-full mt-6"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 mb-12 min-h-[300px] content-start">
            {currentProducts.map((prod, index) => (
              <RevealOnScroll key={prod.id} delay={index * 50} instant={index < initialRestoredCount}>
                <ProductCard product={prod} />
              </RevealOnScroll>
            ))}
          </div>

          {visibleCount < productos.length && (
            <div className="flex justify-center mt-12 mb-14">
              <button
                onClick={handleLoadMore}
                className="bg-pink-600 text-white px-6 md:px-10 py-4 rounded-full font-bold shadow-[0_20px_40px_-5px_rgba(236,72,153,0.3)] hover:shadow-[0_25px_50px_-5px_rgba(236,72,153,0.5)] hover:bg-pink-700 hover:scale-105 transition-all flex items-center gap-2 group w-full sm:w-auto justify-center text-sm md:text-base"
              >
                Ver más productos
                <Flower2 size={20} className="group-hover:rotate-45 transition-transform duration-300 flex-shrink-0" />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="pt-0 pb-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll variant="up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="relative group p-8 rounded-3xl bg-white shadow-[0_10px_30px_-10px_rgba(190,24,93,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(190,24,93,0.2)] hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-50 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-pink-50 rounded-2xl text-pink-600 group-hover:rotate-6 transition-transform duration-300">
                    <Clock size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl mb-2">Entrega Rápida</h3>
                    <p className="text-gray-500 leading-relaxed">Servicio de entrega el mismo día disponible.</p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative group p-8 rounded-3xl bg-white shadow-[0_10px_30px_-10px_rgba(190,24,93,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(190,24,93,0.2)] hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-50 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-pink-50 rounded-2xl text-pink-600 group-hover:rotate-6 transition-transform duration-300">
                    <Sparkles size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl mb-2">100% Frescas</h3>
                    <p className="text-gray-500 leading-relaxed">Garantizamos la frescura de cada flor.</p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative group p-8 rounded-3xl bg-white shadow-[0_10px_30px_-10px_rgba(190,24,93,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(190,24,93,0.2)] hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-50 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-pink-50 rounded-2xl text-pink-600 group-hover:rotate-6 transition-transform duration-300">
                    <Heart size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl mb-2">Hecho con Amor</h3>
                    <p className="text-gray-500 leading-relaxed">Cada arreglo es diseñado con dedicación.</p>
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <Footer />


    </div>
  );
}