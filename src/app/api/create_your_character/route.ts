import { inference } from "@/utils/hf";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    
    const imageBuffer = await inference.textToImage({
      model: "hakurei/waifu-diffusion",
      inputs: prompt,
      options: { wait_for_model: true }
    });
    const arrayBuffer = await imageBuffer.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json({ image: base64Image });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
