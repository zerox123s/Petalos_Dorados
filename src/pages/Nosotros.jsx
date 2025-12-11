import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getOptimizedUnsplashUrl } from '../utils/image';

export default function Nosotros() {
  return (
    <div className="font-sans">
      <Navbar /> {/* Navbar fijo arriba */}
      
      {/* HEADER DE PÁGINA */}
            <div className="relative h-[40vh] bg-black">
              <img
                src={getOptimizedUnsplashUrl("https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80", { width: 1200 })}
                className="w-full h-full object-cover opacity-60"
                alt="Ramo de flores en un fondo oscuro"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-5xl font-bold text-white drop-shadow-lg">Nuestra Historia</h1>
              </div>
            </div>
      
            {/* CONTENIDO */}
            <section className="max-w-6xl mx-auto py-20 px-6">
              <div className="prose prose-lg mx-auto text-gray-600">
                <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">Pasión por los detalles</h2>
                <p className="mb-6 leading-relaxed text-lg">
                  Somos más que una florería; somos mensajeros de emociones. Desde nuestros inicios, nos hemos dedicado a seleccionar las flores más frescas del mercado local para crear arreglos que no solo decoran, sino que hablan.
                </p>
                <p className="mb-6 leading-relaxed text-lg">
                  Cada ramo es confeccionado a mano por floristas expertos que entienden el lenguaje de las flores. Ya sea un "Te amo", un "Perdón" o un "Feliz día", tenemos el arreglo perfecto para expresarlo.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                  <img src={getOptimizedUnsplashUrl("https://images.unsplash.com/photo-1582794543139-8ac92a900275?auto=format&fit=crop&q=80", { width: 600 })} className="rounded-xl shadow-lg hover:shadow-2xl transition" alt="Florista preparando un arreglo floral" />
                  <img src={getOptimizedUnsplashUrl("https://images.unsplash.com/photo-1596627685695-17798b350434?auto=format&fit=crop&q=80", { width: 600 })} className="rounded-xl shadow-lg hover:shadow-2xl transition" alt="Vista detallada de un ramo de flores frescas" />
                </div>
      
                <h3 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Nuestro Compromiso</h3>
                <ul className="list-disc pl-6 space-y-2">            <li>Frescura garantizada de 7 días.</li>
            <li>Entregas puntuales y seguras.</li>
            <li>Diseños personalizados y únicos.</li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
