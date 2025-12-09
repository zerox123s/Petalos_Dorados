import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Optional: Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Optional: Save to local storage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
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
            toast.success(`Se agregaron ${quantity} unidades de ${product.nombre}`, {
                style: { ...toastStyle, fontWeight: 'bold' },
                className: 'md:text-lg md:px-6 md:py-4', // Tailwind classes for desktop
            });
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                )
            );
        } else {
            toast.success(`${product.nombre} agregado al carrito`, {
                style: { ...toastStyle, fontWeight: 'bold' },
                className: 'md:text-lg md:px-6 md:py-4', // Tailwind classes for desktop
            });
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

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
        toast.error('Producto eliminado del carrito');
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
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
