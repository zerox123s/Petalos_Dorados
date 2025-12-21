import { useEffect } from 'react';

/**
 * @param {Object} props
 * @param {string} props.title 
 * @param {string} props.description 
 * @param {string} [props.keywords] 
 */
export default function SEO({ title, description, keywords }) {
    useEffect(() => {
        // Actualizar título
        document.title = title ? `${title} | Pétalos Dorados` : 'Florería Pétalos Dorados | Túcume';

        // Actualizar meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && description) {
            metaDescription.setAttribute('content', description);
        }

        // Actualizar meta keywords si se proporcionan
        if (keywords) {
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute('content', keywords);
            }
        }

        // Actualizar Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogTitle && title) {
            ogTitle.setAttribute('content', `${title} | Florería Pétalos Dorados`);
        }
        if (ogDescription && description) {
            ogDescription.setAttribute('content', description);
        }

        // Actualizar Twitter
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterTitle && title) {
            twitterTitle.setAttribute('content', `${title} | Pétalos Dorados`);
        }
        if (twitterDescription && description) {
            twitterDescription.setAttribute('content', description);
        }
    }, [title, description, keywords]);

    return null;
}
