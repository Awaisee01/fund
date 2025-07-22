import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

interface ConvertImageRequest {
  imageUrls: string[];
}

interface ConvertedImage {
  originalUrl: string;
  webpUrl: string;
  filename: string;
}

interface ConvertImageResponse {
  success: boolean;
  convertedImages?: ConvertedImage[];
  error?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Convert images function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Function start ===');
    console.log('Environment check...');
    
    // List all available environment variables (without values for security)
    const envKeys = Object.keys(Deno.env.toObject());
    console.log('Available env keys:', envKeys);
    
    const apiKey = Deno.env.get('RUNWARE_API_KEY');
    console.log('RUNWARE_API_KEY exists:', !!apiKey);
    console.log('RUNWARE_API_KEY length:', apiKey ? apiKey.length : 'undefined');
    
    if (!apiKey) {
      console.error('RUNWARE_API_KEY not found in environment variables');
      throw new Error('RUNWARE_API_KEY not found in environment variables');
    }

    console.log('API key found, processing request...');

    // Simplified test - just return success for now to see if the function runs
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Function executed successfully, API key found',
        convertedImages: []
      } as ConvertImageResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

    // Convert each image using Runware API
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const filename = filenames[i];
      
      console.log(`Converting image ${i + 1}: ${imageUrl}`);

      try {
        // Create WebSocket connection to Runware API
        const ws = new WebSocket('wss://ws-api.runware.ai/v1');
        
        const conversionPromise = new Promise<string>((resolve, reject) => {
          const taskUUID = crypto.randomUUID();
          let authenticated = false;

          ws.onopen = () => {
            console.log('WebSocket connected for image conversion');
            
            // Send authentication
            const authMessage = [{
              taskType: "authentication",
              apiKey: apiKey
            }];
            
            ws.send(JSON.stringify(authMessage));
          };

          ws.onmessage = (event) => {
            const response = JSON.parse(event.data);
            console.log('WebSocket response:', response);

            if (response.error || response.errors) {
              const errorMessage = response.errorMessage || response.errors?.[0]?.message || "Conversion failed";
              console.error('Conversion error:', errorMessage);
              reject(new Error(errorMessage));
              return;
            }

            if (response.data) {
              response.data.forEach((item: any) => {
                if (item.taskType === "authentication") {
                  console.log('Authentication successful');
                  authenticated = true;
                  
                  // Send image conversion request
                  const conversionMessage = [{
                    taskType: "imageInference",
                    taskUUID: taskUUID,
                    positivePrompt: "High quality, professional image, maintain exact original content and composition, sharp details, vibrant colors",
                    model: "runware:100@1",
                    width: 1920,
                    height: 1080,
                    numberResults: 1,
                    outputFormat: "WEBP",
                    CFGScale: 1,
                    scheduler: "FlowMatchEulerDiscreteScheduler",
                    strength: 0.1,
                    inputImage: imageUrl,
                    steps: 4
                  }];
                  
                  console.log('Sending conversion request for:', filename);
                  ws.send(JSON.stringify(conversionMessage));
                  
                } else if (item.taskType === "imageInference" && item.taskUUID === taskUUID) {
                  console.log(`Conversion completed for ${filename}:`, item.imageURL);
                  ws.close();
                  resolve(item.imageURL);
                }
              });
            }
          };

          ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            reject(new Error('WebSocket connection failed'));
          };

          ws.onclose = () => {
            console.log('WebSocket closed');
            if (!authenticated) {
              reject(new Error('Authentication failed'));
            }
          };

          // Timeout after 30 seconds
          setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.close();
            }
            reject(new Error('Conversion timeout'));
          }, 30000);
        });

        const webpUrl = await conversionPromise;
        
        convertedImages.push({
          originalUrl: imageUrl,
          webpUrl: webpUrl,
          filename: filename
        });

        console.log(`Successfully converted ${filename}`);
        
      } catch (error) {
        console.error(`Failed to convert ${filename}:`, error);
        // Continue with other images even if one fails
      }
    }

    if (convertedImages.length === 0) {
      throw new Error('No images were successfully converted');
    }

    console.log(`Successfully converted ${convertedImages.length} images`);

    return new Response(
      JSON.stringify({
        success: true,
        convertedImages: convertedImages
      } as ConvertImageResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in convert-images-to-webp function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      } as ConvertImageResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});