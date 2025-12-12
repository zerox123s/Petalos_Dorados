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

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [business, setBusiness] = useState(null);
    const [redes, setRedes] = useState([]);
    const [isShopLoading, setIsShopLoading] = useState(true);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }

        const fetchShopData = async () => {
            try {
                const [
                    { data: prods },
                    { data: cats },
                    { data: neg },
                    { data: redesSociales }
                ] = await Promise.all([
                    supabase.from('productos').select('*, categorias(nombre)').eq('activo', true).order('id', { ascending: false }),
                    supabase.from('categorias').select('*').order('nombre', { ascending: true }),
                    supabase.from('negocio').select('*').single(),
                    supabase.from('redes_sociales').select('*').order('created_at', { ascending: true })
                ]);

                if (prods) setProducts(prods);
                if (cats) setCategories(cats);
                if (neg) setBusiness(neg);
                if (redesSociales) setRedes(redesSociales);

            } catch (error) {
                console.error('Error loading shop data:', error);
                toast.error('Error al cargar datos de la tienda');
            } finally {
                setIsShopLoading(false);
            }
        };

        fetchShopData();
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, showToast = true) => {
        const existingItem = cartItems.find((item) => item.id === product.id);

        const toastStyle = {
            fontSize: '16px',
            padding: '16px',
            borderRadius: '12px',
            maxWidth: '500px',
            background: '#1f2937',
            color: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        };

        if (existingItem) {
            if (showToast) {
                toast.success(`Se agregaron ${quantity} unidades de ${product.nombre}`, {
                    style: { ...toastStyle, fontWeight: 'bold' },
                    className: 'md:text-lg md:px-6 md:py-4',
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
                    className: 'md:text-lg md:px-6 md:py-4',
                });
            }
            setCartItems((prevItems) => [...prevItems, { ...product, quantity }]);
        }
    };

    const decreaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === productId);
            if (existingItem?.quantity === 1) {
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
        decreaseQuantity,
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
        redes,
        isShopLoading
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
