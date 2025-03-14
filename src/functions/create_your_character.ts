import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/hakurei/waifu-diffusion",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        },
        responseType: 'arraybuffer'
      }
    );

    const buffer = Buffer.from(response.data);
    const base64Image = buffer.toString('base64');

    return NextResponse.json({ image: base64Image });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
