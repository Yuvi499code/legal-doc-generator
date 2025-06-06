import React, { useState } from "react";
import './App.css';

export default function App() {
  const [businessName, setBusinessName] = useState("");
  const [dataCollected, setDataCollected] = useState([]);
  const [region, setRegion] = useState("global");
  const [generatedText, setGeneratedText] = useState("");

  const dataOptions = ["Email", "Phone", "Location", "Payment Info"];

  const handleGenerate = () => {
    const mockGenerated = `
    Privacy Policy for ${businessName}

    We collect: ${dataCollected.join(", ")}.
    This policy is compliant with ${region.toUpperCase()} data protection laws.
    `;
    setGeneratedText(mockGenerated);
  };

  const handleCheckbox = (value) => {
    setDataCollected((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  return (
    <div className="app-container">
      <div className="form-card">
        <h1 className="app-title">Privacy Policy & Terms Generator</h1>

        <div className="form-group">
          <label>Business/App Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. MyCoolApp"
          />
        </div>

        <div className="form-group">
          <label>Data You Collect</label>
          <div className="checkbox-grid">
            {dataOptions.map((option) => (
              <label key={option} className="checkbox-label">
                <input
                  type="checkbox"
                  value={option}
                  checked={dataCollected.includes(option)}
                  onChange={() => handleCheckbox(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Region (for Compliance)</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="global">Global</option>
            <option value="gdpr">Europe (GDPR)</option>
            <option value="ccpa">California (CCPA)</option>
            <option value="dpdp">India (DPDP)</option>
          </select>
        </div>

        <button onClick={handleGenerate}>Generate Policy</button>
      </div>

      {generatedText && (
        <div className="generated-card">
          <h2>Generated Document</h2>
          <pre>{generatedText}</pre>
        </div>
      )}
    </div>
  );
}
