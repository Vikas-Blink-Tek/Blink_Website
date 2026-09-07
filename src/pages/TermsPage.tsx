import { Link } from 'react-router-dom';
import LegalLayout, { LegalH2 } from '../components/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" updated="29 August 2026">
      <p>
        These Terms &amp; Conditions (“Terms”) govern your use of the Blink Finance website at{' '}
        <a className="text-brand-orange font-bold" href="https://www.blinkfinance.in">www.blinkfinance.in</a>,
        our EMI calculator, enquiry forms, and related communication (together, the “Services”).
        By using the Services you agree to these Terms and to our{' '}
        <Link to="/privacy-policy" className="text-brand-orange font-bold">Privacy Policy</Link>.
        If you do not agree, please do not use the website or submit an enquiry.
      </p>

      <LegalH2>1. Who we are</LegalH2>
      <p>
        Blink Finance is a Direct Selling Agent (DSA) and loan-facilitation / advisory firm. We introduce customers to partner banks and NBFCs,
        help with documentation and follow-up, and explain product options. We are GST-registered (GSTIN 27ABAFB5553C1ZT) with our office at
        FF-12 and FF-13, Delta Vrindavan, G Wing, MIDC Rd, Siddhi Vinayak Nagar, Mahajan Wadi, Mira Road East, Mira Bhayandar, Maharashtra 401107.
      </p>
      <p className="font-bold text-foreground">
        Blink Finance is not a bank, NBFC, or housing-finance company. We do not lend money, take deposits, or decide credit.
        Sanction, rate of interest, tenure, processing fee, insurance, and disbursal are solely at the discretion of the partner lender,
        subject to their policy, KYC, and applicable RBI / NHB directions.
      </p>

      <LegalH2>2. Eligibility</LegalH2>
      <p>
        You must be at least 18 years old and legally able to contract under Indian law. If you enquire on behalf of a company, partnership, or other entity,
        you confirm you are authorised to do so. Loan products have additional lender-specific eligibility (income, credit score, age, property, and similar)
        which we will explain but which the lender finally applies.
      </p>

      <LegalH2>3. Nature of our service</LegalH2>
      <ul className="list-disc pl-5 space-y-2">
        <li>We provide information, comparison support, and file-facilitation. Nothing on the website is a loan offer, guarantee of sanction, or investment advice.</li>
        <li>Indicative rates, tenure, and eligibility shown on the site or discussed by our team are illustrations. Actual terms are in the lender’s sanction letter and loan agreement.</li>
        <li>We may suggest more than one lender. You are free to accept or reject any proposal.</li>
        <li>We do not collect EMIs, cash towards your loan, or “file opening” cash at our office unless a written receipt from the actual lender is involved. Do not pay unknown personal accounts in our name.</li>
      </ul>

      <LegalH2>4. Your responsibilities</LegalH2>
      <p>You agree to:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Provide true, complete, and current information and documents.</li>
        <li>Not impersonate another person or submit forged or altered papers.</li>
        <li>Read the lender’s key fact statement, sanction terms, and loan agreement before you sign.</li>
        <li>Keep OTPs, net-banking passwords, and card CVVs confidential. Our staff will never ask for your banking OTP.</li>
      </ul>
      <p>
        If information you give is false or incomplete, lenders may reject the file, and we may stop assisting you.
        You remain responsible for repayment to the lender once a loan is disbursed.
      </p>

      <LegalH2>5. Fees</LegalH2>
      <p>
        Consultation and use of this website and the EMI calculator are free of charge from Blink Finance, unless we agree a separate written mandate with you.
        Partner banks and NBFCs may levy processing fees, stamp duty, legal/technical charges, insurance, or prepayment charges as per their schedule.
        Those amounts are payable to the lender (or their designated vendor), not as a secret commission demanded in cash by an individual.
        If any Blink Finance professional fee is ever applicable, it will be disclosed to you in writing before you agree.
      </p>
      <p>Website content and EMI reports are provided free; we do not run paid subscriptions or in-app purchases on this site.</p>

      <LegalH2>6. EMI calculator</LegalH2>
      <p>
        The EMI calculator uses the standard monthly reducing-balance formula used by Indian banks:
        EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where r is the monthly rate and n is the number of months.
        Results are estimates for planning only. They do not include processing fees, GST, insurance, or rate resets on floating loans.
        Downloading a PDF may require your name and phone so we can send the report and offer assistance.
      </p>

      <LegalH2>7. Communication consent</LegalH2>
      <p>
        By submitting a form or sharing your number, you agree that Blink Finance and, where needed, partner lenders may contact you by phone, SMS, WhatsApp, or email
        about your enquiry, documents, and related loan options. You may opt out of promotional messages at any time. Transactional updates about a live application may still be sent.
      </p>

      <LegalH2>8. No professional or legal advice</LegalH2>
      <p>
        Content on the website (including FAQs and blogs, if any) is general information. It is not legal, tax, or credit advice.
        Stamp duty, tax benefits (for example, home-loan interest) depend on your facts and current law. Please take independent advice where needed.
      </p>

      <LegalH2>9. Intellectual property</LegalH2>
      <p>
        The Blink Finance name, logo, website design, text, and graphics are owned by us or used with permission.
        You may not copy, scrape, or reuse them for a competing service without our written consent.
        You may share a link to our public pages.
      </p>

      <LegalH2>10. Acceptable use</LegalH2>
      <p>You must not use the Services to:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Break any law, or attempt fraud, money laundering, or identity theft.</li>
        <li>Probe, overload, or attack the website, or bypass security (including reCAPTCHA).</li>
        <li>Harvest contact details of other users or our staff for spam.</li>
        <li>Upload malware or offensive material.</li>
      </ul>
      <p>We may block access or discard an enquiry if we reasonably believe these rules are broken.</p>

      <LegalH2>11. Third-party sites and lenders</LegalH2>
      <p>
        Links to banks, maps, or other websites are for convenience. We do not control their content or policies.
        Your contract for any sanctioned loan is with that lender, not with Blink Finance.
      </p>

      <LegalH2>12. Availability</LegalH2>
      <p>
        We aim to keep the site available but do not guarantee uninterrupted, error-free access. We may change, suspend, or discontinue any page or tool without notice.
      </p>

      <LegalH2>13. Limitation of liability</LegalH2>
      <p>
        To the fullest extent permitted by Indian law, Blink Finance, its partners (including Ashish Ashok Ghadge and Rekha Ghadge), and staff are not liable for:
        a lender’s delay, rejection, or change of terms; your loss from relying on an indicative EMI or rate; third-party outages (hosting, forms, captcha, ads);
        or indirect, incidental, or consequential loss. Nothing in these Terms limits liability for fraud, wilful misconduct, or any liability that cannot be excluded by law.
        Where liability can be capped, it is limited to ₹5,000 or the professional fee you actually paid us in the preceding three months (if any), whichever is higher.
      </p>

      <LegalH2>14. Indemnity</LegalH2>
      <p>
        You agree to indemnify Blink Finance against claims, losses, and reasonable costs arising from your breach of these Terms, inaccurate documents you supplied,
        or your misuse of the Services.
      </p>

      <LegalH2>15. Governing law and disputes</LegalH2>
      <p>
        These Terms are governed by the laws of India. Courts at Mira Bhayandar / Thane, Maharashtra shall have exclusive jurisdiction,
        without affecting any mandatory consumer-protection forum that may be available to you.
      </p>
      <p>
        For a complaint about our facilitation service, first write to our Grievance Officer: Ashish Ashok Ghadge, Managing Partner,
        info@blinkfinance.in, 8828821333, at the Mira Road office address above. We aim to respond within 30 days.
        Complaints about a sanctioned loan (charges, repayment, foreclosure) should be raised with the lender and, if needed, their RBI Ombudsman process.
      </p>

      <LegalH2>16. Changes</LegalH2>
      <p>
        We may update these Terms by posting a new version on this page. The “Last updated” date will change.
        Continued use after an update constitutes acceptance of the revised Terms.
      </p>

      <LegalH2>17. Contact</LegalH2>
      <p>
        Blink Finance<br />
        FF-12 and FF-13, Delta Vrindavan, G Wing, MIDC Rd, Mira Road East, Maharashtra 401107<br />
        Phone: 8828821333<br />
        Email: info@blinkfinance.in
      </p>
    </LegalLayout>
  );
}
