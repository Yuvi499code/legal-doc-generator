import React, { useState } from 'react';
import './App.css'; // Importing the CSS file for styling
// Main App component
export default function App() {
  // State variables for all form inputs
  const [documentType, setDocumentType] = useState('privacy-policy'); // Default to Privacy Policy
  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(''); //YYYY-MM-DD format for input type="date"

  // Privacy Policy specific states
  const [dataCollected, setDataCollected] = useState([]);
  const [thirdPartyServices, setThirdPartyServices] = useState(''); // Will be split by newlines
  const [usesCookies, setUsesCookies] = useState(false);
  const [collectsChildrenData, setCollectsChildrenData] = useState(false);

  // Terms and Conditions specific states
  const [governingLawCountryOrState, setGoverningLawCountryOrState] = useState('');
  const [hasSubscriptions, setHasSubscriptions] = useState(false);

  // State for generated document and loading
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Predefined options for data collected (can be extended)
  const dataOptions = ["Name", "Email Address", "Phone Number", "Physical Address", "IP Address", "Payment Information", "Usage Data", "Location Data", "Device Information"];

  // Helper function to handle checkbox changes for dataCollected
  const handleDataCollectedChange = (value) => {
    setDataCollected((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Function to handle the document generation API call
  const handleGenerateDocument = async () => {
    setError(''); // Clear previous errors
    setGeneratedDocument(''); // Clear previous document
    setIsLoading(true); // Set loading state

    // Basic validation
    if (!companyName || !websiteUrl || !contactEmail || !effectiveDate) {
      setError('Please fill in all required general fields.');
      setIsLoading(false);
      return;
    }

    // Construct the payload for the backend API
    const payload = {
      documentType,
      companyName,
      websiteUrl,
      contactEmail,
      effectiveDate,
    };

    if (documentType === 'privacy-policy') {
      payload.dataCollected = dataCollected;
      payload.thirdPartyServices = thirdPartyServices.split('\n').filter(item => item.trim() !== ''); // Split by newline and filter empty
      payload.usesCookies = usesCookies;
      payload.collectsChildrenData = collectsChildrenData;
    } else if (documentType === 'terms-and-conditions') {
      payload.governingLawCountryOrState = governingLawCountryOrState;
      payload.hasSubscriptions = hasSubscriptions;
    }

    try {
      // Make the POST request to the backend
      const response = await fetch('http://localhost:5000/api/generate-document', { // Ensure this URL matches your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if the response was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate document');
      }

      // Parse the JSON response
      const data = await response.json();
      setGeneratedDocument(data.document); // Set the generated document content

    } catch (err) {
      console.error('Error generating document:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <>
      {/* CSS Styles embedded directly for single-file compilation */}
      <style>
        {`

        `}
      </style>

      {/* Main container using custom CSS class for responsiveness and centering */}
      <div className="app-wrapper">
        <div className="card">
          <h1 className="app-title">Legal Document Generator</h1>

          {/* Document Type Selection */}
          <div className="form-group">
            <label className="block-label">Select Document Type:</label>
            <div className="radio-options">
              <label className="radio-label">
                <input
                  type="radio"
                  className="custom-radio"
                  name="documentType"
                  value="privacy-policy"
                  checked={documentType === 'privacy-policy'}
                  onChange={() => setDocumentType('privacy-policy')}
                />
                <span>Privacy Policy</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  className="custom-radio"
                  name="documentType"
                  value="terms-and-conditions"
                  checked={documentType === 'terms-and-conditions'}
                  onChange={() => setDocumentType('terms-and-conditions')}
                />
                <span>Terms and Conditions</span>
              </label>
            </div>
          </div>

          {/* General Information Section */}
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="companyName">
                Your Company/App Name: <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                placeholder="e.g., Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="websiteUrl">
                Your Website URL: <span className="required-star">*</span>
              </label>
              <input
                type="url"
                id="websiteUrl"
                placeholder="e.g., https://www.example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactEmail">
                Contact Email: <span className="required-star">*</span>
              </label>
              <input
                type="email"
                id="contactEmail"
                placeholder="e.g., support@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="effectiveDate">
                Effective Date: <span className="required-star">*</span>
              </label>
              <input
                type="date"
                id="effectiveDate"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Conditional Fields for Privacy Policy */}
          {documentType === 'privacy-policy' && (
            <div className="section-divider">
              <h2 className="section-heading">Privacy Policy Specifics</h2>
              <div className="form-group">
                <label className="block-label">
                  Types of Data You Collect:
                </label>
                <div className="checkbox-options-grid">
                  {dataOptions.map((option) => (
                    <label key={option} className="checkbox-label">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        value={option}
                        checked={dataCollected.includes(option)}
                        onChange={() => handleDataCollectedChange(option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="thirdPartyServices">
                  Third-Party Services Used (one per line):
                </label>
                <textarea
                  id="thirdPartyServices"
                  rows="3"
                  placeholder="e.g., Google Analytics&#10;Stripe&#10;Mailchimp"
                  value={thirdPartyServices}
                  onChange={(e) => setThirdPartyServices(e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={usesCookies}
                    onChange={(e) => setUsesCookies(e.target.checked)}
                  />
                  <span>Do you use cookies or similar tracking technologies?</span>
                </label>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={collectsChildrenData}
                    onChange={(e) => setCollectsChildrenData(e.target.checked)}
                  />
                  <span>Do you knowingly collect data from children under 13?</span>
                </label>
              </div>
            </div>
          )}

          {/* Conditional Fields for Terms and Conditions */}
          {documentType === 'terms-and-conditions' && (
            <div className="section-divider">
              <h2 className="section-heading">Terms and Conditions Specifics</h2>
              <div className="form-group">
                <label htmlFor="governingLaw">
                  Governing Law (Country/State):
                </label>
                <input
                  type="text"
                  id="governingLaw"
                  placeholder="e.g., India or California"
                  value={governingLawCountryOrState}
                  onChange={(e) => setGoverningLawCountryOrState(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={hasSubscriptions}
                    onChange={(e) => setHasSubscriptions(e.target.checked)}
                  />
                  <span>Does your service offer subscriptions?</span>
                </label>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerateDocument}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Generating...' : 'Generate Document'}
          </button>

          {/* Error Display */}
          {error && (
            <div className="error-alert" role="alert">
              <strong>Error!</strong>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Generated Document Display */}
        {generatedDocument && (
          <div className="card generated-document-container">
            <h2 className="section-heading">Generated Document Preview</h2>
            <div className="document-preview-box">
              <pre className="generated-content">
                {generatedDocument}
              </pre>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
