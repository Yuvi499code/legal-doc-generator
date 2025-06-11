import React, { useState, useEffect } from 'react';
import './App.css'; 
import Tutorial from './Tutorial';

const privacyPolicyTemplate = `
# Privacy Policy

**Effective Date:** [EFFECTIVE_DATE]

This Privacy Policy describes how [YOUR_COMPANY_NAME] ("we," "us," or "our") collects, uses, and discloses information when you use our website, [YOUR_WEBSITE_URL] (the "Service").

## 1. Information We Collect

We collect information in a few ways:

* **Information you provide to us directly:** This includes information you provide when you register for an account, fill out a form, or contact us. Examples may include:
    [TYPES_OF_DATA_COLLECTED]

* **Information collected automatically:** When you access or use our Service, we may automatically collect certain information, such as your IP address, browser type, operating system, and usage data.

* **Cookies:** We may use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.

## 2. How We Use Your Information

We use the collected information for various purposes, including:
* To provide and maintain our Service.
* To improve, personalize, and expand our Service.
* To communicate with you.
* To monitor and analyze the usage of our Service.

## 3. Sharing Your Information

We may share your information with third parties in the following situations:
* **Service Providers:** We may employ third-party companies and individuals to facilitate our Service. Examples: [THIRD_PARTY_SERVICES]
* **Compliance with Laws:** We may disclose your information where required to do so by law or in response to valid requests by public authorities.

## 4. Your Rights

Depending on your location, you may have certain rights regarding your personal data.

## 5. Children's Privacy

Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.

## 6. Contact Us

If you have any questions about this Privacy Policy, please contact us at:
[YOUR_CONTACT_EMAIL]
`;

const termsAndConditionsTemplate = `
# Terms and Conditions

**Last updated:** [EFFECTIVE_DATE]

Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the [YOUR_WEBSITE_URL] website operated by [YOUR_COMPANY_NAME] ("us", "we", or "our").

## 1. Acceptance of Terms

By accessing and using the Service, you accept and agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.

## 2. Intellectual Property

The Service and its original content, features, and functionality are and will remain the exclusive property of [YOUR_COMPANY_NAME] and its licensors.

## 3. Links To Other Web Sites

Our Service may contain links to third-party web sites or services that are not owned or controlled by [YOUR_COMPANY_NAME].

## 4. Termination

We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

## 5. Governing Law

These Terms shall be governed and construed in accordance with the laws of [GOVERNING_LAW_COUNTRY_OR_STATE], without regard to its conflict of law provisions.

## 6. Subscriptions

Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Each Subscription period will automatically renew unless canceled at least 24 hours before the end of the current period.

## 7. Changes

We reserve the right, at our sole discretion, to modify or replace these Terms at any time.

## 8. Contact Us

If you have any questions about these Terms, please contact us at:
[YOUR_CONTACT_EMAIL]
`;

export default function App() {
  const [documentType, setDocumentType] = useState('privacy-policy');
  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');

  const [dataCollected, setDataCollected] = useState([]);
  const [thirdPartyServices, setThirdPartyServices] = useState('');
  const [usesCookies, setUsesCookies] = useState(false);
  const [collectsChildrenData, setCollectsChildrenData] = useState(false);

  const [governingLawCountryOrState, setGoverningLawCountryOrState] = useState('');
  const [hasSubscriptions, setHasSubscriptions] = useState(false);

  const [generatedDocument, setGeneratedDocument] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const totalTutorialSteps = 6;

  useEffect(() => {
    const hasViewed = localStorage.getItem('hasViewedTutorial');
    const isMobile = window.innerWidth < 768;
    if (!hasViewed && !isMobile) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    const generatePreview = () => {
      let templateToUse = documentType === 'privacy-policy' ? privacyPolicyTemplate : termsAndConditionsTemplate;

      let generatedDoc = templateToUse
        .replace(/\[YOUR_COMPANY_NAME\]/g, companyName || '[Your Company Name]')
        .replace(/\[YOUR_WEBSITE_URL\]/g, websiteUrl || '[yourwebsite.com]')
        .replace(/\[YOUR_CONTACT_EMAIL\]/g, contactEmail || '[contact@email.com]')
        .replace(/\[EFFECTIVE_DATE\]/g, effectiveDate || '[Effective Date]');

      const removeBlock = (doc, startTag, endTag) => doc.replace(new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'g'), '');
      const keepBlock = (doc, startTag, endTag) => doc.replace(new RegExp(`${startTag}|${endTag}`, 'g'), '');

      if (documentType === 'privacy-policy') {
        const formattedDataCollected = dataCollected.length > 0 ? dataCollected.map(item => `\n    * ${item}`).join('') : '\n    * Not specified.';
        generatedDoc = generatedDoc.replace(/\[TYPES_OF_DATA_COLLECTED\]/g, formattedDataCollected);

        const formattedThirdPartyServices = thirdPartyServices.split('\n').filter(item => item.trim() !== '').map(item => `- ${item}`).join('\n') || 'None specified.';
        generatedDoc = generatedDoc.replace(/\[THIRD_PARTY_SERVICES\]/g, formattedThirdPartyServices);

        generatedDoc = usesCookies ? keepBlock(generatedDoc, '<!-- IF_USES_COOKIES -->', '<!-- END_IF_USES_COOKIES -->') : removeBlock(generatedDoc, '<!-- IF_USES_COOKIES -->', '<!-- END_IF_USES_COOKIES -->');
        generatedDoc = collectsChildrenData ? keepBlock(generatedDoc, '<!-- IF_COLLECTS_CHILDREN_DATA -->', '<!-- END_IF_COLLECTS_CHILDREN_DATA -->') : removeBlock(generatedDoc, '<!-- IF_COLLECTS_CHILDREN_DATA -->', '<!-- END_IF_COLLECTS_CHILDREN_DATA -->');
      }

      if (documentType === 'terms-and-conditions') {
        generatedDoc = generatedDoc.replace(/\[GOVERNING_LAW_COUNTRY_OR_STATE\]/g, governingLawCountryOrState || '[Governing Law]');
        generatedDoc = hasSubscriptions ? keepBlock(generatedDoc, '<!-- IF_HAS_SUBSCRIPTIONS -->', '<!-- END_IF_HAS_SUBSCRIPTIONS -->') : removeBlock(generatedDoc, '<!-- IF_HAS_SUBSCRIPTIONS -->', '<!-- END_IF_HAS_SUBSCRIPTIONS -->');
      }

      setGeneratedDocument(generatedDoc.replace(/[\s\S]*?/g, ''));
    };

    generatePreview();
  }, [documentType, companyName, websiteUrl, contactEmail, effectiveDate, dataCollected, thirdPartyServices, usesCookies, collectsChildrenData, governingLawCountryOrState, hasSubscriptions]);

  const handleNextTutorialStep = () => tutorialStep < totalTutorialSteps - 1 ? setTutorialStep(tutorialStep + 1) : finishTutorial();
  const handlePrevTutorialStep = () => tutorialStep > 0 && setTutorialStep(tutorialStep - 1);
  const finishTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hasViewedTutorial', 'true');
  };

  const dataOptions = ["Name", "Email Address", "Phone Number", "Physical Address", "IP Address", "Payment Information", "Usage Data", "Location Data", "Device Information"];
  const handleDataCollectedChange = (value) => setDataCollected(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);

  const handleDownloadPdf = async () => {
    if (!generatedDocument) return;
    setIsDownloading(true);
    setError('');

    const filename = `${documentType}_${(companyName || 'doc').replace(/\s/g, '_')}`;
    try {
      const response = await fetch('http://localhost:5000/api/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentContent: generatedDocument, documentName: filename }),
      });
      if (!response.ok) throw new Error(await response.text());
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during PDF download.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {showTutorial && <Tutorial step={tutorialStep} onNext={handleNextTutorialStep} onPrev={handlePrevTutorialStep} onSkip={finishTutorial} totalSteps={totalTutorialSteps} />}
      <div className="app-layout">
        <div className="form-container">
          <h1 className="app-title">Legal Document Generator</h1>
          <div className="form-group" id="document-type-group">
            <label>Select Document Type:</label>
            <div className="radio-options">
              <label className="radio-label">
                <input type="radio" className="custom-radio" name="documentType" value="privacy-policy" checked={documentType === 'privacy-policy'} onChange={() => setDocumentType('privacy-policy')} />
                <span>Privacy Policy</span>
              </label>
              <label className="radio-label">
                <input type="radio" className="custom-radio" name="documentType" value="terms-and-conditions" checked={documentType === 'terms-and-conditions'} onChange={() => setDocumentType('terms-and-conditions')} />
                <span>Terms and Conditions</span>
              </label>
            </div>
          </div>

          <div id="general-info-grid">
            <h2 className="section-heading">General Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="companyName">Company/App Name: <span className="required-star">*</span></label>
                <input type="text" id="companyName" placeholder="e.g., Acme Corp" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="websiteUrl">Website URL: <span className="required-star">*</span></label>
                <input type="url" id="websiteUrl" placeholder="e.g., https://www.example.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email: <span className="required-star">*</span></label>
                <input type="email" id="contactEmail" placeholder="e.g., support@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="effectiveDate">Effective Date: <span className="required-star">*</span></label>
                <input type="date" id="effectiveDate" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} required />
              </div>
            </div>
          </div>

          <div id="document-specifics-section">
            {documentType === 'privacy-policy' && (
              <div className="section-divider">
                <h2 className="section-heading">Privacy Policy Specifics</h2>
                <div className="form-group">
                  <label>Types of Data You Collect:</label>
                  <div className="checkbox-options-grid">
                    {dataOptions.map(option => (
                      <label key={option} className="checkbox-label">
                        <input type="checkbox" className="custom-checkbox" value={option} checked={dataCollected.includes(option)} onChange={() => handleDataCollectedChange(option)} />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="thirdPartyServices">Third-Party Services Used (one per line):</label>
                  <textarea id="thirdPartyServices" rows="3" placeholder="e.g., Google Analytics
Stripe" value={thirdPartyServices} onChange={(e) => setThirdPartyServices(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" className="custom-checkbox" checked={usesCookies} onChange={(e) => setUsesCookies(e.target.checked)} />
                    <span>Do you use cookies?</span>
                  </label>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" className="custom-checkbox" checked={collectsChildrenData} onChange={(e) => setCollectsChildrenData(e.target.checked)} />
                    <span>Do you collect data from children under 13?</span>
                  </label>
                </div>
              </div>
            )}
            {documentType === 'terms-and-conditions' && (
              <div className="section-divider">
                <h2 className="section-heading">Terms and Conditions Specifics</h2>
                <div className="form-group">
                  <label htmlFor="governingLaw">Governing Law (Country/State):</label>
                  <input type="text" id="governingLaw" placeholder="e.g., California, USA" value={governingLawCountryOrState} onChange={(e) => setGoverningLawCountryOrState(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" className="custom-checkbox" checked={hasSubscriptions} onChange={(e) => setHasSubscriptions(e.target.checked)} />
                    <span>Does your service offer subscriptions?</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          {error && <div className="error-alert" role="alert"><strong>Error:</strong> {error}</div>}
        </div>

        <div className="preview-container" id="preview-container">
          <h2 className="section-heading">Live Preview</h2>
          <div className="document-preview-box">
            {generatedDocument.trim() ? (
              <pre className="generated-content">{generatedDocument}</pre>
            ) : (
              <div className="preview-placeholder">
                <p>Your document will appear here as you fill out the form.</p>
              </div>
            )}
          </div>
          <div className="preview-controls">
            <button id="download-button" className="download-button" onClick={handleDownloadPdf} disabled={isDownloading || !generatedDocument.trim()}>
              {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}