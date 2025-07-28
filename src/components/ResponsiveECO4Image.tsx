interface ResponsiveECO4ImageProps {
  alt: string;
  className?: string;
}

const ResponsiveECO4Image = ({ alt, className }: ResponsiveECO4ImageProps) => {
  return (
    <picture className={className}>
      {/* Desktop WebP */}
      <source 
        media="(min-width: 1200px)" 
        srcSet="/lovable-uploads/eco4-hero-desktop.webp" 
        type="image/webp"
        width={1920}
        height={1080}
      />
      
      {/* Tablet WebP */}
      <source 
        media="(min-width: 768px)" 
        srcSet="/lovable-uploads/eco4-hero-tablet.webp" 
        type="image/webp"
        width={1024}
        height={768}
      />
      
      {/* Mobile WebP */}
      <source 
        media="(max-width: 767px)" 
        srcSet="/lovable-uploads/eco4-hero-mobile.webp" 
        type="image/webp"
        width={768}
        height={1024}
      />
      
      {/* Fallback PNG for browsers that don't support WebP */}
      <img
        src="/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png"
        alt={alt}
        className="w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        width={1920}
        height={1080}
      />
    </picture>
  );
};

export default ResponsiveECO4Image;