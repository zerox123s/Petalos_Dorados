import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useLayoutEffect } from 'react';
import toast from 'react-hot-toast';
import { ShoppingCart, Leaf, Share2, Minus, Plus, Flower, ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { getOptimizedCloudinaryUrl } from '../utils/image';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { products, addToCart, isShopLoading } = useCart();
    const [quantity, setQuantity] = useState(1);


    // Derive product synchronously
    const product = products.find(p => p.id === parseInt(id));

    useLayoutEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' }); // Instant scroll to top on load
    }, [id]);

    const handleAddToCart = () => {
        if (!product?.activo) return;
        addToCart(product, quantity);
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleShare = async () => {
        const shareData = {
            title: product.nombre,
            text: `¡Mira este hermoso arreglo que encontré en Pétalos Dorados!`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // User cancelled share
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('¡Enlace copiado al portapapeles!');
        }
    };

    if (isShopLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 size={40} className="text-pink-600 animate-spin" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
                    <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
                    <Link to="/" className="bg-pink-600 text-white px-6 py-3 rounded-full font-bold hover:bg-pink-700 transition">
                        Volver a la tienda
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const imageUrl = getOptimizedCloudinaryUrl(product.imagen_url, { width: 800 });

    const fromCategories = location.state?.from?.includes('/categorias');

    const crumbs = [
        { label: 'Inicio', link: '/' },
        ...(fromCategories ? [{ label: product.categorias?.nombre || 'Categorías', link: product.categorias ? `/categorias#${product.categorias.nombre.toLowerCase().replace(/ /g, '-')}` : '/categorias' }] : []),
        { label: product.nombre, link: null }
    ];

    const relatedProducts = product
        ? products.filter(p => p.id !== product.id && p.categoria_id === product.categoria_id).slice(0, 4)
        : [];

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            <Navbar />
            <Breadcrumbs crumbs={crumbs} />

            <main className="flex-1 w-full pb-5">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                    <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col lg:flex-row mb-16">

                        {/* Image Section */}
                        <div className="w-full lg:w-1/2 relative bg-gray-100 h-[350px] lg:h-auto group">
                            <img
                                src={imageUrl || 'https://via.placeholder.com/800'}
                                alt={product.nombre}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Category Badge */}
                            <div className="absolute top-6 left-6 z-10">
                                <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
                                    <Flower size={16} className="text-pink-600" />
                                    {product.categorias?.nombre}
                                </span>
                            </div>
                            {/* Share Button */}
                            <button
                                onClick={handleShare}
                                className="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-gray-500 hover:text-pink-600 hover:scale-110 transition-all z-10"
                                title="Compartir"
                            >
                                <Share2 size={24} />
                            </button>
                        </div>

                        {/* Details Section */}
                        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col">
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">{product.nombre}</h1>

                                <div className="flex items-center gap-6 mb-8">
                                    <span className="text-4xl font-bold text-pink-600">S/. {product.precio.toFixed(2)}</span>
                                    {product.activo ? (
                                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                                            <Leaf size={16} />
                                            <span>Disponible</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                            <span>Agotado</span>
                                        </div>
                                    )}
                                </div>

                                <div className="prose prose-pink prose-lg text-gray-600 mb-10">
                                    <ul className="space-y-2 border-l-4 border-pink-100 pl-6 list-none">
                                        {product.descripcion?.split('\n').filter(l => l.trim()).map((line, i) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-600 font-light">
                                                <span className="text-pink-400 mt-1.5">•</span>
                                                <span className="leading-relaxed">{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Quantity Selector */}
                                {product.activo && (
                                    <div className="mb-10">
                                        <span className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Cantidad</span>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 shadow-sm">
                                                <button
                                                    onClick={decrementQuantity}
                                                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-pink-600 transition-colors disabled:opacity-50"
                                                    disabled={quantity <= 1}
                                                >
                                                    <Minus size={20} />
                                                </button>
                                                <span className="w-10 text-center font-bold text-gray-900 text-xl">{quantity}</span>
                                                <button
                                                    onClick={incrementQuantity}
                                                    className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-pink-600 transition-colors"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Footer */}
                            <div className="mt-auto pt-6 border-t border-gray-100">
                                {product.activo ? (
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-pink-600 text-white px-8 py-5 rounded-full font-bold text-lg shadow-xl shadow-pink-200 hover:bg-pink-700 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                    >
                                        <ShoppingCart size={24} />
                                        <span>Agregar al Carrito • S/. {(product.precio * quantity).toFixed(2)}</span>
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full bg-gray-200 text-gray-400 px-8 py-5 rounded-full font-bold text-lg cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        Producto No Disponible
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related Products Section */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16 animate-fade-in-up">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <span className="w-2 h-8 bg-pink-600 rounded-full"></span>
                                También te podría gustar
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {relatedProducts.map((related) => (
                                    <ProductCard key={related.id} product={related} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}
