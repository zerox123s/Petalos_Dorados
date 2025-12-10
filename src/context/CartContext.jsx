import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../supabase';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Global Shop Data
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [business, setBusiness] = useState(null);
    const [isShopLoading, setIsShopLoading] = useState(true);

    // Initial Data Fetch & Local Storage
    useEffect(() => {
        // Local Storage for Cart
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }

        // Fetch Global Shop Data
        const fetchShopData = async () => {
            try {
                const [
                    { data: prods },
                    { data: cats },
                    { data: neg }
                ] = await Promise.all([
                    supabase.from('productos').select('*, categorias(nombre)').eq('activo', true).order('id', { ascending: false }),
                    supabase.from('categorias').select('*').order('nombre', { ascending: true }),
                    supabase.from('negocio').select('*').single()
                ]);

                if (prods) setProducts(prods);
                if (cats) setCategories(cats);
                if (neg) setBusiness(neg);
            } catch (error) {
                console.error('Error loading shop data:', error);
                toast.error('Error al cargar datos de la tienda');
            } finally {
                setIsShopLoading(false);
            }
        };

        fetchShopData();
    }, []);

    // Save Cart to Local Storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, showToast = true) => {
        // Check existence based on current state, NOT inside the setter
        const existingItem = cartItems.find((item) => item.id === product.id);

        // Toast Styles
        const toastStyle = {
            fontSize: '16px',
            padding: '16px',
            borderRadius: '12px',
            maxWidth: '500px',
            background: '#1f2937', // Dark gray (Tailwind gray-800)
            color: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        };

        // Desktop override logic (handled via CSS/media queries usually, but inline styles work for simple cases)
        // For a more robust solution, we can use className and Tailwind, but react-hot-toast accepts style objects.
        // We'll make it slightly larger by default as requested.

        if (existingItem) {
            if (showToast) {
                toast.success(`Se agregaron ${quantity} unidades de ${product.nombre}`, {
                    style: { ...toastStyle, fontWeight: 'bold' },
                    className: 'md:text-lg md:px-6 md:py-4', // Tailwind classes for desktop
                });
            }
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                )
            );
        } else {
            if (showToast) {
                toast.success(`${product.nombre} agregado al carrito`, {
                    style: { ...toastStyle, fontWeight: 'bold' },
                    className: 'md:text-lg md:px-6 md:py-4', // Tailwind classes for desktop
                });
            }
            setCartItems((prevItems) => [...prevItems, { ...product, quantity }]);
        }
    };

    const decreaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === productId);
            if (existingItem?.quantity === 1) {
                // Si solo queda uno, lo eliminamos
                return prevItems.filter(item => item.id !== productId);
            }
            return prevItems.map(item =>
                item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            );
        });
    };

    const removeFromCart = (productId, showToast = true) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
        if (showToast) {
            toast.error('Producto eliminado del carrito');
        }
    };

    const clearCart = () => {
        setCartItems([]);
        toast('Carrito vaciado', { icon: '🗑️' });
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const value = {
        cartItems,
        addToCart,
        decreaseQuantity, // <-- Exportar la nueva función
        removeFromCart,
        clearCart,
        cartCount,
        isCartOpen,
        toggleCart,
        openCart,
        closeCart,
        products,
        categories,
        business,
        isShopLoading
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
