# Text Summarizer

A full-stack tool that accepts unstructured text, sends it to an LLM, 
and returns a structured summary with sentiment analysis and 
confidence scoring.

Built as a take-home assignment. Deliberately kept small — the focus 
is on prompt quality, clean architecture, and honest engineering decisions.

---

## Example Output
```json
{
  "summary": "NASA's Perseverance rover has successfully collected rock samples from Mars that scientists believe may contain signs of ancient microbial life.",
  "keyPoints": [
    "The samples were gathered from the Jezero Crater, a former lake bed.",
    "Researchers are particularly excited about organic molecules detected in the sedimentary rock layers.",
    "The samples will be returned to Earth in the late 2030s via a joint NASA-ESA mission."
  ],
  "sentiment": "positive",
  "confidence": "high"
}
```

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React + Vite 5 | Fast setup, minimal boilerplate, easy to explain in a follow-up |
| Backend | Node.js + Express | Single-responsibility API server, every line is explainable |
| LLM | Groq API (llama-3.1-8b-instant) | Genuinely free tier, fast inference, reliable JSON output |
| Env management | dotenv | Standard, keeps API key out of source control |
| Cross-origin | cors | Required for local frontend-to-backend communication |

---

## Setup

### Prerequisites
- Node.js 20+
- A free Groq API key from [console.groq.com](https://console.groq.com)

### Install
```bash
# Clone the repo
git clone <your-repo-url>
cd assignment-summarizer

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Configure environment
```bash
cd server
cp .env.example .env
```

Open server/.env and add your Groq API key:
GROQ_API_KEY=your_key_here
PORT=3001

### Run

In one terminal:
```bash
cd server
node src/index.js
```

In another terminal:
```bash
cd client
npm run dev
```

Open http://localhost:5173

---

## Prompt Design

The prompt instructs the model to behave as a strict JSON extractor 
with no other role. The output schema is defined upfront with exact 
field names and types. Hard constraints are listed explicitly: exactly 
one sentence for summary, exactly three key points, sentiment must be 
one of three allowed values, confidence must reflect source text clarity.

This design reduces parsing failures by leaving the model no ambiguity 
about format. Prose responses, markdown, and extra keys are all 
explicitly prohibited.

The backend adds a second layer of defence: markdown fences are stripped 
before JSON.parse, invalid sentiment and confidence values are normalized 
rather than thrown, and keyPoints arrays are padded or sliced to exactly 
three items. The app never crashes on a slightly malformed model response.

---

## API Choice

Groq was chosen over OpenAI for two reasons. First, the free tier is 
genuinely free with no billing setup required, which made iteration 
fast. Second, llama-3.1-8b-instant follows constrained JSON prompts 
reliably and responds quickly. This was a deliberate choice rather 
than defaulting to the obvious option.

---

## Trade-offs and Shortcuts

**No database.** There is no user state to persist. Adding SQLite would 
have been complexity without purpose — a deliberate omission, not an 
oversight.

**No authentication.** This is a single-user local tool. Auth would add 
30 minutes of setup for zero real benefit at this scope.

**Minimal UI.** Time went into prompt quality and error handling rather 
than visual polish. The interface is functional and clean but not designed.

**No test suite.** The scope was 1-2 hours. Manual testing covered the 
critical paths: empty input, API failure, malformed model response, 
file upload, and character limit.

---

## What I Would Add With More Time

- **Batch processing** — accept a folder of .txt files and summarize each
- **Audio input via AssemblyAI** — transcribe an uploaded audio file, 
  then pipe the transcript through the summarizer
- **Custom output schema** — let the user define extra fields via a 
  config flag or JSON schema file
- **Streaming response** — stream the LLM output token by token for 
  a better UX on long texts
- **Export** — download the structured result as JSON or markdown

---

## Project Structure
assignment-summarizer/
client/
src/
App.jsx        # Full UI component
App.css        # All styles
main.jsx       # React entry point
index.html
vite.config.js
package.json
server/
src/
index.js       # Express server and routes
llm.js         # Groq API call and response parsing
prompt.js      # Prompt builder
validate.js    # Input validation
.env.example
package.json
README.md

---

## Health Check

The server exposes a health endpoint:
GET http://localhost:3001/health
 { "status": "ok", "timestamp": "..." }

---
