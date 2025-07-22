import { useState, useCallback, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  responsive?: boolean;
  avifSrc?: string;
  webpSrc?: string;
  mobileSrc?: string;
  mobileAvifSrc?: string;
  mobileWebpSrc?: string;
  preload?: boolean;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  priority = false,
  width,
  height,
  style,
  onLoad,
  onError,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  responsive = false,
  avifSrc,
  webpSrc,
  mobileSrc,
  mobileAvifSrc,
  mobileWebpSrc,
  preload = false
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Generate AVIF srcSet
  const generateAvifSrcSet = () => {
    const srcSet = [];
    
    if (mobileAvifSrc) {
      srcSet.push(`${mobileAvifSrc} 768w`);
    }
    if (avifSrc) {
      srcSet.push(`${avifSrc} 1920w`);
    }
    
    return srcSet.length > 0 ? srcSet.join(', ') : undefined;
  };

  // Generate WebP srcSet
  const generateWebpSrcSet = () => {
    const srcSet = [];
    
    if (mobileWebpSrc) {
      srcSet.push(`${mobileWebpSrc} 768w`);
    }
    if (webpSrc) {
      srcSet.push(`${webpSrc} 1920w`);
    }
    
    return srcSet.length > 0 ? srcSet.join(', ') : undefined;
  };

  // Generate fallback srcSet
  const generateFallbackSrcSet = () => {
    const srcSet = [];
    
    if (mobileSrc) {
      srcSet.push(`${mobileSrc} 768w`);
    }
    srcSet.push(`${src} 1920w`);
    
    return srcSet.length > 1 ? srcSet.join(', ') : undefined;
  };

  // Add preload links for priority images
  useEffect(() => {
    if (preload && priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      
      // Preload the best format available
      if (avifSrc && window.matchMedia('(min-width: 769px)').matches) {
        link.href = avifSrc;
        link.type = 'image/avif';
      } else if (webpSrc && window.matchMedia('(min-width: 769px)').matches) {
        link.href = webpSrc;
        link.type = 'image/webp';
      } else if (mobileAvifSrc && window.matchMedia('(max-width: 768px)').matches) {
        link.href = mobileAvifSrc;
        link.type = 'image/avif';
      } else if (mobileWebpSrc && window.matchMedia('(max-width: 768px)').matches) {
        link.href = mobileWebpSrc;
        link.type = 'image/webp';
      } else {
        link.href = src;
      }
      
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [preload, priority, avifSrc, webpSrc, mobileAvifSrc, mobileWebpSrc, src]);


  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`} 
        style={{
          ...style,
          minHeight: height ? `${height}px` : '200px',
          aspectRatio: width && height ? `${width}/${height}` : 'auto'
        }}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className}`} 
      style={{
        ...style,
        minHeight: height ? `${height}px` : 'auto',
        aspectRatio: width && height ? `${width}/${height}` : 'auto'
      }}
    >
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      )}
      
      {/* Use picture element for modern format support */}
      <picture className="w-full h-full">
        {/* AVIF source with responsive images - best compression */}
        {(avifSrc || mobileAvifSrc) && (
          <source 
            srcSet={generateAvifSrcSet()}
            sizes={responsive ? sizes : undefined}
            type="image/avif" 
          />
        )}
        
        {/* WebP source with responsive images - fallback */}
        {(webpSrc || mobileWebpSrc) && (
          <source 
            srcSet={generateWebpSrcSet()}
            sizes={responsive ? sizes : undefined}
            type="image/webp" 
          />
        )}
        
        {/* Fallback with responsive images */}
          <img
            src={src}
            srcSet={responsive ? generateFallbackSrcSet() : undefined}
            sizes={responsive ? sizes : undefined}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          style={{ 
            contentVisibility: 'auto',
            containIntrinsicSize: width && height ? `${width}px ${height}px` : 'auto',
            aspectRatio: width && height ? `${width}/${height}` : 'auto',
            objectFit: 'cover'
          }}
        />
      </picture>
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  );
};

export default OptimizedImage;
