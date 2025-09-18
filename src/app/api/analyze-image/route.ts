
import { GoogleGenerativeAI, Schema } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || ' ');

async function base64ToGenerativePart(base64: string, mimeType: string) {
  return {
    inlineData: {
      data: base64.split(',')[1],
      mimeType,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    // Define the JSON schema for the expected response, including the summary
    const schema: Schema = {
      type: "OBJECT",
      properties: {
        microplastics: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              label: {
                type: "STRING",
                description: "The type of microplastic (e.g., 'Fragment', 'Fiber', 'Pellet')."
              },
              box_2d: {
                type: "ARRAY",
                items: {
                  type: "NUMBER"
                },
                description: "Normalized bounding box coordinates [xmin, ymin, xmax, ymax]."
              }
            },
            required: ["label", "box_2d"]
          }
        },
        summary: {
          type: "OBJECT",
          properties: {
            fragment_count: {
              type: "NUMBER",
              description: "Total number of 'Fragment' type microplastics detected."
            },
            fiber_count: {
              type: "NUMBER",
              description: "Total number of 'Fiber' type microplastics detected."
            },
            pellet_count: {
              type: "NUMBER",
              description: "Total number of 'Pellet' type microplastics detected."
            }
          },
          required: ["fragment_count", "fiber_count", "pellet_count"]
        }
      },
      required: ["microplastics", "summary"]
    };

    // Get the generative model with the structured output configuration
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const imagePart = await base64ToGenerativePart(image, 'image/jpeg');

    // Update the prompt to request the summary counts
    const prompt = `You are an expert in microplastic detection. Analyze the provided image of a water sample and identify any microplastics present. 
    Return an array of all detected microplastics, including their label and bounding box. 
    Also, provide a summary with the total count for each type of microplastic: 'Fragment', 'Fiber', and 'Pellet'. 
    If no microplastics are detected, return an empty array for the "microplastics" key and a count of 0 for each summary field.`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;

    // The response text is now a guaranteed JSON string that fits the schema
    const analysis = JSON.parse(response.text());

    return NextResponse.json({ imageUrl: image, analysis });
    
  } catch (error) {
    console.error('Error analyzing image:', error);
    // Provide a more structured error response
    const analysis = { microplastics: [], summary: { fragment_count: 0, fiber_count: 0, pellet_count: 0 } };
    return NextResponse.json({ 
        imageUrl: "", 
        analysis,
        error: 'Error analyzing image.  Internal Server Error' 
    }, { status: 500 });
  }
}
