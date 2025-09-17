import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const imagePart = {
      inlineData: {
        data: image.split(",")[1],
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([
      "What are the objects in this image?",
      imagePart,
    ]);
    const response = await result.response;
    const text = await response.text();

    return NextResponse.json({ results: text });
  } catch (error) { 
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { error: "Error analyzing image" },
      { status: 500 }
    );
  }
}
