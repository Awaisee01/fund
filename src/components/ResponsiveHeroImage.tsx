interface ResponsiveHeroImageProps {
  alt: string;
  className?: string;
}

const ResponsiveHeroImage = ({ alt, className }: ResponsiveHeroImageProps) => {
  return (
    <picture className={className}>
      {/* Desktop WebP */}
      <source 
        media="(min-width: 1200px)" 
        srcSet="/lovable-uploads/hero-desktop.webp" 
        type="image/webp"
        width={1920}
        height={1080}
      />
      
      {/* Tablet WebP */}
      <source 
        media="(min-width: 768px)" 
        srcSet="/lovable-uploads/hero-tablet.webp" 
        type="image/webp"
        width={1024}
        height={768}
      />
      
      {/* Mobile WebP */}
      <source 
        media="(max-width: 767px)" 
        srcSet="/lovable-uploads/hero-mobile.webp" 
        type="image/webp"
        width={768}
        height={1024}
      />
      
      {/* Fallback PNG for browsers that don't support WebP */}
      <img
        src="/lovable-uploads/2aa49ae8-73b1-423e-a150-6873ec2f9cf6.png"
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

export default ResponsiveHeroImage;