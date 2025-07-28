import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false 
}: OptimizedImageProps) {
  // Generate responsive image sizes for PageSpeed optimization
  const generateSrcSet = (originalSrc: string) => {
    const sizes = [192, 384, 576, 768, 960, 1152, 1344, 1536];
    return sizes
      .map(size => `${originalSrc}?w=${size} ${size}w`)
      .join(', ');
  };

  // Use WebP format when supported for better compression
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  return (
    <picture>
      <source srcSet={generateSrcSet(webpSrc)} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        style={{
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto',
          maxWidth: '100%'
        }}
      />
    </picture>
  );
}

export default OptimizedImage;