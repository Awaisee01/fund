import { useState, useCallback } from 'react';

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
  webpSrc?: string;
  mobileSrc?: string;
  mobileWebpSrc?: string;
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
  webpSrc,
  mobileSrc,
  mobileWebpSrc
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

  // Generate responsive srcSet
  const generateSrcSet = () => {
    const srcSet = [];
    
    // Add mobile WebP if available
    if (mobileWebpSrc) {
      srcSet.push(`${mobileWebpSrc} 768w`);
    }
    
    // Add desktop WebP if available
    if (webpSrc) {
      srcSet.push(`${webpSrc} 1920w`);
    }
    
    return srcSet.length > 0 ? srcSet.join(', ') : undefined;
  };

  // Generate fallback srcSet for non-WebP
  const generateFallbackSrcSet = () => {
    const srcSet = [];
    
    // Add mobile version if available
    if (mobileSrc) {
      srcSet.push(`${mobileSrc} 768w`);
    }
    
    // Add desktop version
    srcSet.push(`${src} 1920w`);
    
    return srcSet.length > 1 ? srcSet.join(', ') : undefined;
  };


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
      
      {/* Use picture element for better format support */}
      <picture className="w-full h-full">
        {/* WebP source with responsive images */}
        {(webpSrc || mobileWebpSrc) && (
          <source 
            srcSet={generateSrcSet()}
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
