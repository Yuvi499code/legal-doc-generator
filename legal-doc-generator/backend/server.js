// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing of JSON request bodies

// --- Legal Templates (UPDATED with conditional markers) ---
const privacyPolicyTemplate = `
# Privacy Policy

**Effective Date:** [EFFECTIVE_DATE]

This Privacy Policy describes how [YOUR_COMPANY_NAME] ("we," "us," or "our") collects, uses, and discloses information when you use our website, [YOUR_WEBSITE_URL] (the "Service").

## 1. Information We Collect

We collect information in a few ways:

* **Information you provide to us directly:** This includes information you provide when you register for an account, fill out a form, or contact us. Examples may include:
    * [TYPES_OF_DATA_COLLECTED]

* **Information collected automatically:** When you access or use our Service, we may automatically collect certain information, such as your IP address, browser type, operating system, and usage data.

<!-- IF_USES_COOKIES -->
* **Cookies:** We may use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
<!-- END_IF_USES_COOKIES -->

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

<!-- IF_COLLECTS_CHILDREN_DATA -->
## 5. Children's Privacy

Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
<!-- END_IF_COLLECTS_CHILDREN_DATA -->

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

<!-- IF_HAS_SUBSCRIPTIONS -->
## 6. Subscriptions

Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Each Subscription period will automatically renew unless canceled at least 24 hours before the end of the current period.
<!-- END_IF_HAS_SUBSCRIPTIONS -->

## 7. Changes

We reserve the right, at our sole discretion, to modify or replace these Terms at any time.

## 8. Contact Us

If you have any questions about these Terms, please contact us at:
[YOUR_CONTACT_EMAIL]
`;
// --- End Legal Templates ---

// Basic test route
app.get('/', (req, res) => {
    res.send('Legal Document Generator Backend is running!');
});

// API Route for document generation
app.post('/api/generate-document', async (req, res) => {
    const {
        documentType,
        companyName,
        websiteUrl,
        contactEmail,
        effectiveDate,
        dataCollected,          // Expected as an array, e.g., ["Name", "Email", "IP Address"]
        thirdPartyServices,     // Expected as an array, e.g., ["Google Analytics", "Stripe"]
        governingLawCountryOrState, // Specific to T&C
        // New boolean flags from frontend for conditional sections
        usesCookies,
        collectsChildrenData,
        hasSubscriptions
    } = req.body;

    // --- Basic Input Validation ---
    if (!documentType || !companyName || !websiteUrl || !contactEmail || !effectiveDate) {
        return res.status(400).json({
            message: 'Missing required fields. Please provide document type, company name, website URL, contact email, and effective date.'
        });
    }

    let generatedDocument = '';
    let templateToUse = '';

    if (documentType === 'privacy-policy') {
        templateToUse = privacyPolicyTemplate;
    } else if (documentType === 'terms-and-conditions') {
        templateToUse = termsAndConditionsTemplate;
    } else {
        return res.status(400).json({ message: 'Invalid document type specified.' });
    }

    // --- Basic String Replacements (always happen) ---
    generatedDocument = templateToUse
        .replace(/\[YOUR_COMPANY_NAME\]/g, companyName || '[Company Name Missing]')
        .replace(/\[YOUR_WEBSITE_URL\]/g, websiteUrl || '[Website URL Missing]')
        .replace(/\[YOUR_CONTACT_EMAIL\]/g, contactEmail || '[Contact Email Missing]')
        .replace(/\[EFFECTIVE_DATE\]/g, effectiveDate || '[Effective Date Missing]');

    // --- Dynamic List Formatting ---
    // For dataCollected (Privacy Policy)
    let formattedDataCollected = 'Not specified.';
    if (Array.isArray(dataCollected) && dataCollected.length > 0) {
        formattedDataCollected = dataCollected.map(item => `- ${item}`).join('\n');
    }
    generatedDocument = generatedDocument.replace(/\[TYPES_OF_DATA_COLLECTED\]/g, formattedDataCollected);

    // For thirdPartyServices (Privacy Policy)
    let formattedThirdPartyServices = 'None specified.';
    if (Array.isArray(thirdPartyServices) && thirdPartyServices.length > 0) {
        formattedThirdPartyServices = thirdPartyServices.map(item => `- ${item}`).join('\n');
    }
    generatedDocument = generatedDocument.replace(/\[THIRD_PARTY_SERVICES\]/g, formattedThirdPartyServices);


    // --- Conditional Sections Logic ---
    // Helper function to remove a block if condition is false
    const removeBlock = (doc, startTag, endTag) => {
        const regex = new RegExp(`${startTag}[\\s\\S]*?${endTag}`, 'g');
        return doc.replace(regex, '');
    };

    // Helper function to keep a block, removing only the tags
    const keepBlock = (doc, startTag, endTag) => {
        const regex = new RegExp(`${startTag}([\\s\\S]*?)${endTag}`, 'g');
        return doc.replace(regex, '$1');
    };

    // Conditional logic for Privacy Policy
    if (documentType === 'privacy-policy') {
        if (usesCookies) {
            generatedDocument = keepBlock(generatedDocument, '<!-- IF_USES_COOKIES -->', '<!-- END_IF_USES_COOKIES -->');
        } else {
            generatedDocument = removeBlock(generatedDocument, '<!-- IF_USES_COOKIES -->', '<!-- END_IF_USES_COOKIES -->');
        }

        if (collectsChildrenData) {
            generatedDocument = keepBlock(generatedDocument, '<!-- IF_COLLECTS_CHILDREN_DATA -->', '<!-- END_IF_COLLECTS_CHILDREN_DATA -->');
        } else {
            generatedDocument = removeBlock(generatedDocument, '<!-- IF_COLLECTS_CHILDREN_DATA -->', '<!-- END_IF_COLLECTS_CHILDREN_DATA -->');
        }
    }

    // Conditional logic for Terms and Conditions
    if (documentType === 'terms-and-conditions') {
        // Specific replacement for T&C's governing law
        generatedDocument = generatedDocument.replace(/\[GOVERNING_LAW_COUNTRY_OR_STATE\]/g, governingLawCountryOrState || '[Governing Law Country/State Missing]');

        if (hasSubscriptions) {
            generatedDocument = keepBlock(generatedDocument, '<!-- IF_HAS_SUBSCRIPTIONS -->', '<!-- END_IF_HAS_SUBSCRIPTIONS -->');
        } else {
            generatedDocument = removeBlock(generatedDocument, '<!-- IF_HAS_SUBSCRIPTIONS -->', '<!-- END_IF_HAS_SUBSCRIPTIONS -->');
        }
    }

    // Final Cleanup: Remove any remaining conditional tags that weren't handled
    // This is a safety net to ensure no stray markers appear in the final document.
    generatedDocument = generatedDocument.replace(/<!-- IF_[A-Z_]+ -->[\s\S]*?<!-- END_IF_[A-Z_]+ -->/g, '');


    res.json({ document: generatedDocument });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
});
