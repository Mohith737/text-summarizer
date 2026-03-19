export function buildPrompt(text) {
  return `You are a strict JSON extractor, nothing else.
Return ONLY valid JSON.
Do not include markdown.
Do not include backticks.
Do not include any prose before or after the JSON.

Return this exact JSON shape:
{
  "summary": "exactly one sentence",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "positive | neutral | negative",
  "confidence": "high | medium | low"
}

Rules:
- summary must be exactly one sentence.
- keyPoints MUST contain EXACTLY 3 items, never 2, never 4. 
  If the text only supports 2 natural points, synthesize a third 
  from the content. This is mandatory.
- Each keyPoint must be a different sentence, do not repeat the 
  summary as a key point.
- sentiment must be one of: positive, neutral, negative.
- confidence must be one of: high, medium, low.
- confidence should reflect how clear and unambiguous the source text was.

Text to analyze:
${text}`;
}