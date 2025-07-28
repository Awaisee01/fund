interface ResponsiveHeroImageProps {
  alt: string;
  className?: string;
}

const ResponsiveHeroImage = ({ alt, className }: ResponsiveHeroImageProps) => {
  return (
    <picture className={className}>
      {/* AVIF - Most modern and efficient */}
      <source 
        media="(min-width: 1200px)" 
        srcSet="/lovable-uploads/hero-desktop.avif" 
        type="image/avif"
        width={1920}
        height={1080}
      />
      <source 
        media="(min-width: 768px)" 
        srcSet="/lovable-uploads/hero-tablet.avif" 
        type="image/avif"
        width={1024}
        height={768}
      />
      <source 
        media="(max-width: 767px)" 
        srcSet="/lovable-uploads/hero-mobile.avif" 
        type="image/avif"
        width={768}
        height={1024}
      />
      
      {/* WebP - Fallback for browsers without AVIF */}
      <source 
        media="(min-width: 1200px)" 
        srcSet="/lovable-uploads/hero-desktop.webp" 
        type="image/webp"
        width={1920}
        height={1080}
      />
      <source 
        media="(min-width: 768px)" 
        srcSet="/lovable-uploads/hero-tablet.webp" 
        type="image/webp"
        width={1024}
        height={768}
      />
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
        sizes="(min-width: 1200px) 1920px, (min-width: 768px) 1024px, 100vw"
        srcSet="/lovable-uploads/hero-desktop.webp 1920w, /lovable-uploads/hero-tablet.webp 1024w, /lovable-uploads/hero-mobile.webp 768w"
      />
    </picture>
  );
};

export default ResponsiveHeroImage;