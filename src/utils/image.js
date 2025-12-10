// src/utils/image.js

/**
 * Generates an optimized Cloudinary URL with specified transformations.
 * @param {string} originalUrl - The original secure_url from Cloudinary.
 * @param {object} options - The transformation options.
 * @param {number} [options.width] - The target width of the image.
 * @param {number} [options.height] - The target height of the image.
 * @param {string} [options.crop='fill'] - The crop mode (e.g., 'fill', 'fit', 'limit').
 * @returns {string} The new URL with optimization and resize parameters.
 */
export const getOptimizedCloudinaryUrl = (originalUrl, { width, height, crop = 'fill' }) => {
  if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
    return originalUrl;
  }

  const transformations = [
    'f_auto', // Auto format
    'q_auto', // Auto quality
  ];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width || height) transformations.push(`c_${crop}`);

  const transformationString = transformations.join(',');

  // The structure is: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<public_id>
  return originalUrl.replace('/upload/', `/upload/${transformationString}/`);
};

/**
 * Generates an optimized Unsplash URL with specified transformations.
 * @param {string} originalUrl - The original Unsplash URL.
 * @param {object} options - The transformation options.
 * @param {number} [options.width] - The target width of the image.
 * @param {number} [options.height] - The target height of the image.
 * @param {number} [options.quality=75] - The image quality (0-100).
 * @param {boolean} [options.autoFormat=true] - Whether to automatically select the best format.
 * @returns {string} The new URL with optimization parameters.
 */
export const getOptimizedUnsplashUrl = (originalUrl, { width, height, quality = 75, autoFormat = true }) => {
  if (!originalUrl || !originalUrl.includes('unsplash.com')) {
    return originalUrl;
  }

  const url = new URL(originalUrl);
  
  if (width) url.searchParams.set('w', width);
  if (height) url.searchParams.set('h', height);
  if (quality) url.searchParams.set('q', quality);
  if (autoFormat) url.searchParams.set('auto', 'format');
  
  // Ensures the base URL is clean before adding params
  const baseUrl = url.origin + url.pathname;
  return `${baseUrl}?${url.searchParams.toString()}`;
};

