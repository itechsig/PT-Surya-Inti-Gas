import { useState, useRef, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * LazyImage Component with fallback support
 * Automatically handles lazy loading and provides fallback on error
 */
export function LazyImage({
  src,
  alt,
  fallback = '/placeholder.png',
  className,
  loading = 'lazy',
  ...props
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallback);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}, using fallback`);
      setImageSrc(fallback);
      setIsLoaded(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallback]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      loading={loading}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className || ''}`}
      {...props}
    />
  );
}

/**
 * Custom hook for lazy loading images
 * @returns { loadImage, isLoading, error } - functions and states for image loading
 */
export function useLazyImage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        setIsLoading(false);
        resolve(img);
      };
      
      img.onerror = () => {
        setIsLoading(false);
        setError(`Failed to load image: ${src}`);
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  };

  return { loadImage, isLoading, error };
}
