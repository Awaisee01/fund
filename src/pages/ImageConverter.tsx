import ImageConversionStatus from '@/components/ImageConversionStatus';

const ImageConverterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🚀 Image Performance Optimizer
          </h1>
          <p className="text-lg text-gray-600">
            Convert your hero images to WebP format for lightning-fast loading
          </p>
        </div>
        
        <ImageConversionStatus />
      </div>
    </div>
  );
};

export default ImageConverterPage;