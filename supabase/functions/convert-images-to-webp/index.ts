import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RUNWARE_API_ENDPOINT = "https://api.runware.ai/v1";

interface ConvertImageRequest {
  imageUrl: string;
  outputName: string;
  width?: number;
  height?: number;
}

interface ConvertImageResponse {
  success: boolean;
  webpUrl?: string;
  error?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('RUNWARE_API_KEY');
    if (!apiKey) {
      throw new Error('RUNWARE_API_KEY not found in environment variables');
    }

    const { imageUrl, outputName, width = 1920, height = 1080 }: ConvertImageRequest = await req.json();

    if (!imageUrl || !outputName) {
      throw new Error('imageUrl and outputName are required');
    }

    console.log(`Converting image: ${imageUrl} to WebP format`);

    // Convert image using Runware API with image-to-image conversion
    const runwarePayload = [
      {
        "taskType": "authentication",
        "apiKey": apiKey
      },
      {
        "taskType": "imageInference",
        "taskUUID": crypto.randomUUID(),
        "positivePrompt": "High quality, professional, detailed, ultra sharp, maintain original content and composition exactly",
        "model": "runware:100@1",
        "width": width,
        "height": height,
        "numberResults": 1,
        "outputFormat": "WEBP",
        "CFGScale": 1,
        "scheduler": "FlowMatchEulerDiscreteScheduler",
        "strength": 0.1, // Very low strength to maintain original image
        "inputImage": imageUrl, // Use the original image as input
        "steps": 4
      }
    ];

    console.log('Sending request to Runware API...');

    const response = await fetch(RUNWARE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(runwarePayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Runware API error:', errorText);
      throw new Error(`Runware API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Runware API response:', result);

    if (result.data && result.data.length > 0) {
      const imageData = result.data.find((item: any) => item.taskType === 'imageInference');
      
      if (imageData && imageData.imageURL) {
        console.log(`Successfully converted image: ${imageData.imageURL}`);
        
        return new Response(
          JSON.stringify({
            success: true,
            webpUrl: imageData.imageURL,
            originalUrl: imageUrl,
            outputName: outputName
          } as ConvertImageResponse),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } else {
        throw new Error('No image data returned from Runware API');
      }
    } else {
      throw new Error('Invalid response from Runware API');
    }

  } catch (error) {
    console.error('Error converting image:', error);
    
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