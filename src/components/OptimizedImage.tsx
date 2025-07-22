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
}

const OptimizedImage = ({ 
  src, 
  alt,
  className = '',
  width,
  height,
  priority = false,
  style
}: OptimizedImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      className={className}
      style={style}
    />
  );
};

export default OptimizedImage;