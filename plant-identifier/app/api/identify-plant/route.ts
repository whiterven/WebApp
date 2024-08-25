import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Access API key securely from environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  // -- Security: Origin Check (Start) -- 

  const origin = request.headers.get('origin') || request.headers.get('Origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS
                         ? process.env.ALLOWED_ORIGINS.split(',')
                         : ['http://localhost:3000']; // Default for local dev

  if (origin && !allowedOrigins.includes(origin)) {
    console.error('Origin not allowed:', origin);
    return new Response('Not allowed', { status: 403 });
  }

  // -- Security: Origin Check (End) -- 

  const formData = await request.formData();
  const image = formData.get('image') as File;

  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageParts = [
      {
        inlineData: {
          data: await image.arrayBuffer().then(buf => Buffer.from(buf).toString('base64')),
          mimeType: image.type,
        },
      },
    ];

    const prompt = "Identify this plant and provide important information about it, including its scientific name, common name, family, origin, and any interesting facts.";

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error('Error identifying plant:', error);
    return NextResponse.json({ error: 'Error identifying plant' }, { status: 500 });
  }
}