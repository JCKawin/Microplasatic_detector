import { GoogleGenerativeAI } from '@google/generative-ai';
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    const imagePart = await base64ToGenerativePart(image, 'image/jpeg');

    const prompt = `You are an expert in microplastic detection. Analyze the provided image of a water sample and identify any microplastics present.

    Your task is to return a JSON object with a single key: "microplastics".
    The value of "microplastics" should be an array of objects, where each object represents a detected microplastic.
    Each microplastic object must have the following two keys:
    1. "label": A string specifying the type of microplastic (e.g., "Fragment", "Fiber", "Pellet").
    2. "box_2d": An array of four numbers representing the normalized bounding box coordinates [xmin, ymin, xmax, ymax] of the microplastic.
    
    If no microplastics are detected, return an empty array for the "microplastics" key.
    
    Example of a valid response:
    {
      "microplastics": [
        {
          "label": "Fragment",
          "box_2d": [0.1, 0.2, 0.3, 0.4]
        },
        {
          "label": "Fiber",
          "box_2d": [0.5, 0.6, 0.7, 0.8]
        }
      ]
    }
    
    Example of a valid response when no microplastics are found:
    {
      "microplastics": []
    }
    
    Do not include any other text or formatting in your response. The response must be a single, valid JSON object.`;

    const result = await model.generateContent([prompt, imagePart]);

    const response = result.response.text();
    
    // Clean the response to ensure it's valid JSON
    const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();

    let analysis;
    try {
        analysis = JSON.parse(cleanedResponse);
    } catch {
        console.error("Failed to parse Gemini response:", cleanedResponse);
        // If parsing fails, return a response indicating no microplastics were found
        analysis = { microplastics: [] };
    }


    return NextResponse.json({ imageUrl: image, analysis });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Error analyzing image' }, { status: 500 });
  }
}
