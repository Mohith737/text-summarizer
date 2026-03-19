import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  async function handleSubmit() {
    if (!text.trim() || loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:3001/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const raw = await response.text();
      let data = null;

      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        setError(data?.error || "Something went wrong. Please try again.");
        return;
      }

      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setText(reader.result);
    };
    reader.readAsText(file);
  }

  function handleReset() {
    setText("");
    setResult(null);
    setError(null);
    setFileName(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const confidenceNote =
    result?.confidence === "high"
      ? "The source text was clear and unambiguous."
      : result?.confidence === "medium"
        ? "Some interpretation was needed."
        : "The text was vague or unclear.";

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1 className="title">Text Summarizer</h1>
          <p className="subtitle">
            Paste text or upload a .txt file to extract a structured summary
          </p>
        </div>

        <div className="input-section">
          <textarea
            className="textarea"
            rows={8}
            placeholder="Paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />

          <div className={`char-counter ${text.length > 15000 ? "over-limit" : ""}`}>
            {text.length} / 15,000 characters
          </div>

          <div className="file-upload-row">
            <label htmlFor="file-upload">or upload a .txt file</label>
            <input
              id="file-upload"
              type="file"
              accept=".txt"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={loading}
            />
            {fileName !== null ? (
              <span className="file-name">{"\u{1F4C4}"} {fileName}</span>
            ) : null}
          </div>

          <button
            className="btn-primary"
            disabled={loading || !text.trim() || text.length > 15000}
            onClick={handleSubmit}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {error !== null ? (
          <div className="error-box">
            <span>{error}</span>
            <button className="dismiss-btn" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        ) : null}

        {result !== null && !loading ? (
          <div className="results">
            <div className="card">
              <h3>Summary</h3>
              <p className="summary-text">{result.summary}</p>
            </div>

            <div className="card">
              <h3>Key Points</h3>
              <ul className="key-points-list">
                {result.keyPoints.map((point) => (
                  <li key={point} className="key-point-item">
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card sentiment-card">
              <h3>Sentiment</h3>
              <span className={`badge sentiment-${result.sentiment}`}>
                {result.sentiment.toUpperCase()}
              </span>
            </div>

            <div className="card confidence-card">
              <h3>Confidence</h3>
              <span className={`badge confidence-${result.confidence}`}>
                {result.confidence.toUpperCase()}
              </span>
              <p className="confidence-note">{confidenceNote}</p>
            </div>

            <button className="btn-secondary" onClick={handleReset}>
              Analyze Another
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
