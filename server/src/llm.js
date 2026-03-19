import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { buildPrompt } from './prompt.js';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function summarizeText(text) {
  const prompt = buildPrompt(text);
  
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1024,
  });

  const raw = response.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, '').trim();
  
  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch(e) {
    throw new Error('Model returned malformed JSON');
  }

  const requiredKeys = ['summary', 'keyPoints', 'sentiment', 'confidence'];
  const hasAllRequiredKeys = requiredKeys.every((key) =>
    Object.prototype.hasOwnProperty.call(parsed, key)
  );

  if (!hasAllRequiredKeys) {
    throw new Error('Model response missing required fields');
  }

  if (!['positive', 'neutral', 'negative'].includes(parsed.sentiment)) {
    parsed.sentiment = 'neutral';
  }

  if (!['high', 'medium', 'low'].includes(parsed.confidence)) {
    parsed.confidence = 'medium';
  }

  if (!Array.isArray(parsed.keyPoints)) {
    parsed.keyPoints = [];
  }

  if (parsed.keyPoints.length > 3) {
    parsed.keyPoints = parsed.keyPoints.slice(0, 3);
  }

  while (parsed.keyPoints.length < 3) {
    parsed.keyPoints.push('No additional point extracted');
  }

  return parsed;
}
