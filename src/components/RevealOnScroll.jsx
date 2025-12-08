import { useEffect, useState, useRef } from 'react';

export default function RevealOnScroll({ children, delay = 0, className = "", variant = 'up' }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const getVariantClasses = () => {
        switch (variant) {
            case 'left':
                return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8';
            case 'right':
                return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8';
            case 'zoom':
                return isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95';
            case 'fade':
                return isVisible ? 'opacity-100' : 'opacity-0';
            case 'up':
            default:
                return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';
        }
    };

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-in-out transform ${getVariantClasses()} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
