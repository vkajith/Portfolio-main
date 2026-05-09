import { NextRequest, NextResponse } from 'next/server';
import { VYSYAKH_CONTEXT, getFallbackResponse } from '@/app/lib/context';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // If no API key, use fallback keyword matching
    if (!GEMINI_API_KEY) {
      const reply = getFallbackResponse(message);
      return NextResponse.json({ reply });
    }

    // Use Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: VYSYAKH_CONTEXT }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: message }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      const reply = getFallbackResponse(message);
      return NextResponse.json({ reply });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || getFallbackResponse(message);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Try again.' },
      { status: 500 }
    );
  }
}
