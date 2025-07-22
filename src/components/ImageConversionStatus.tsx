import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ConvertedImage {
  originalUrl: string;
  webpUrl: string;
  filename: string;
}

const ImageConversionStatus = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [hasConverted, setHasConverted] = useState(false);

  const handleConvertImages = async () => {
    setIsConverting(true);
    setConvertedImages([]);
    
    try {
      toast.info('🔄 Starting image conversion to WebP format...');
      
      const { data, error } = await supabase.functions.invoke('convert-images-to-webp', {
        body: {}
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success && data?.convertedImages) {
        setConvertedImages(data.convertedImages);
        setHasConverted(true);
        toast.success(`🎉 Successfully converted ${data.convertedImages.length} images to WebP!`);
      } else {
        throw new Error(data?.error || 'Conversion failed');
      }
      
    } catch (error) {
      console.error('Error converting images:', error);
      toast.error(`❌ Conversion failed: ${error.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
      toast.success(`✅ Downloaded ${filename}`);
    } catch (error) {
      toast.error(`❌ Failed to download ${filename}`);
    }
  };

  const openImage = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>🖼️ Convert Hero Images to WebP</CardTitle>
        <CardDescription>
          Convert your existing PNG hero images to optimized WebP format for faster loading and better performance.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <Button 
            onClick={handleConvertImages}
            disabled={isConverting}
            size="lg"
            className="px-8"
          >
            {isConverting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Converting Images...
              </>
            ) : (
              hasConverted ? 'Convert Again' : 'Convert All Hero Images'
            )}
          </Button>
        </div>

        {isConverting && (
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-500" />
            <p className="text-blue-700">Converting your images to WebP format...</p>
            <p className="text-sm text-blue-600 mt-1">This may take up to 30 seconds per image</p>
          </div>
        )}

        {convertedImages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-700">✅ Conversion Complete!</h3>
            
            {convertedImages.map((image, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-medium text-green-800">{image.filename}</p>
                    <p className="text-sm text-green-600">WebP format • Optimized for web</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openImage(image.webpUrl)}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => downloadImage(image.webpUrl, image.filename)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-2">📋 Next Steps:</h4>
              <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                <li>Download all the WebP images above</li>
                <li>Upload them to your project's public/images/ folder</li>
                <li>Update your hero image components to use the new WebP versions</li>
                <li>Your images will load significantly faster!</li>
              </ol>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Images to convert:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>ECO4 Hero Image → hero-eco4.webp</li>
            <li>Gas Boiler Hero Image → hero-gas-boiler.webp</li>
            <li>Home Improvements Hero Image → hero-home-improvements.webp</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageConversionStatus;