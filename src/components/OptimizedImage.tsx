import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  responsive?: boolean;
  sizes?: string;
  preload?: boolean;
  style?: React.CSSProperties;
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
}

const OptimizedImage = ({ 
  src, 
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes,
  fetchPriority = 'auto',
  decoding = 'async',
  style
}: OptimizedImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : fetchPriority}
      decoding={decoding}
      sizes={sizes}
      className={className}
      style={style}
    />
  );
};

export default OptimizedImage;