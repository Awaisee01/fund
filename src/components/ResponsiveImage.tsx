import { useState, useEffect, useRef } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

const ResponsiveImage = ({ 
  src, 
  alt, 
  className = "",
  sizes = "(max-width: 320px) 192px, (max-width: 640px) 288px, (max-width: 1024px) 384px, 512px",
  priority = false,
  width,
  height
}: ResponsiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate responsive image URLs based on display size
  const generateResponsiveSrcSet = (originalSrc: string) => {
    const baseName = originalSrc.split('.').slice(0, -1).join('.');
    const extension = originalSrc.split('.').pop();
    
    // Create multiple sizes for different viewport widths
    const sizes = [192, 288, 384, 512, 768, 1024];
    
    const webpSrcSet = sizes.map(size => 
      `${baseName}-${size}w.webp ${size}w`
    ).join(', ');
    
    const fallbackSrcSet = sizes.map(size => 
      `${baseName}-${size}w.${extension} ${size}w`
    ).join(', ');

    return { webpSrcSet, fallbackSrcSet };
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => {
      setIsLoaded(true);
      // Mark LCP element if priority
      if (priority) {
        performance.mark('lcp-image-loaded');
      }
    };

    const handleError = () => {
      setError(true);
      setIsLoaded(true); // Still show fallback
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [priority]);

  const { webpSrcSet, fallbackSrcSet } = generateResponsiveSrcSet(src);

  return (
    <div className={`relative ${className} ${isLoaded ? 'loaded' : 'loading'}`}>
      <picture>
        <source
          srcSet={webpSrcSet}
          sizes={sizes}
          type="image/webp"
        />
        <source
          srcSet={fallbackSrcSet}
          sizes={sizes}
          type={`image/${src.split('.').pop()}`}
        />
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'low'}
          decoding={priority ? 'sync' : 'async'}
          width={width}
          height={height}
          sizes={sizes}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        />
      </picture>
      
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Image unavailable</div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveImage;