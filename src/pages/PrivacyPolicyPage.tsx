import { Link } from 'react-router-dom';
import LegalLayout, { LegalH2 } from '../components/LegalLayout';

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="29 August 2026">
      <p>
        <strong>Blink Fin-Advisory Pvt. Ltd.</strong>, operating under the established brand name <strong>Blink Finance</strong> (“we”, “us”, “our”) is a Direct Selling Agent (DSA) and loan-facilitation firm based in Mira Road, Maharashtra.
        We help individuals and businesses compare and apply for loans from partner banks and NBFCs. We do not ourselves sanction or disburse credit.
        This Privacy Policy explains what personal data we collect on <a className="text-brand-orange font-bold" href="https://www.blinkfinance.in">www.blinkfinance.in</a>,
        why we use it, who we share it with, and the rights you have under the Digital Personal Data Protection Act, 2023 (DPDP Act).
      </p>
      <p>
        This policy applies to our website, enquiry forms, EMI calculator, WhatsApp/phone enquiries, and emails. It does not cover how a bank or NBFC
        uses your data after they receive an application — that is governed by that lender’s own privacy notice.
      </p>

      <LegalH2>1. Who is responsible for your data</LegalH2>
      <p>
        For information you give us on this website or over a call/WhatsApp, Blink Finance acts as the organisation deciding why that data is used
        (a “Data Fiduciary” under the DPDP Act). When we share your enquiry with a partner bank or NBFC so they can assess a loan, that lender
        becomes responsible for how they use the data for credit assessment, KYC, and disbursal.
      </p>
      <p>
        <span className="font-bold text-foreground">Legal entity:</span> Blink Fin-Advisory Pvt. Ltd. (Brand: Blink Finance)<br />
        <span className="font-bold text-foreground">GSTIN:</span> 27ABAFB5553C1ZT<br />
        <span className="font-bold text-foreground">Office:</span> FF-12 and FF-13, Delta Vrindavan, G Wing, MIDC Rd, Siddhi Vinayak Nagar, Mahajan Wadi, Mira Road East, Mira Bhayandar, Maharashtra 401107<br />
        <span className="font-bold text-foreground">Email:</span> info@blinkfinance.in<br />
        <span className="font-bold text-foreground">Phone:</span> 8828821333
      </p>

      <LegalH2>2. Information we collect</LegalH2>
      <p>We only ask for what we need to respond to your enquiry and to match you with a suitable lender. This typically includes:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Identity and contact details — name, mobile number, email (if you provide one), city.</li>
        <li>Loan preference — product type (home, personal, business, mortgage, MSME, car, overdraft, and similar), and indicative amount or tenure if you share it.</li>
        <li>EMI calculator inputs — loan amount, interest rate, and tenure you type in, plus the name and phone number you enter to download a PDF report.</li>
        <li>Messages you send us — WhatsApp, phone notes, or email content and attachments you choose to share (for example, income proof you send for a file check).</li>
        <li>Technical data — IP address, browser type, device, pages visited, date and time, and referring site, collected through server logs and cookies.</li>
        <li>Marketing identifiers — if you consent, Meta (Facebook) Pixel and similar tools may collect a limited device/browser identifier so we can measure ads and website visits.</li>
      </ul>
      <p>We do not ask you to type card numbers, CVV, net-banking passwords, or Aadhaar OTP on this website.</p>

      <LegalH2>3. How we collect it</LegalH2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Directly from you, when you fill the Apply form, download an EMI report, call 8828821333, or message us on WhatsApp.</li>
        <li>Automatically, through cookies, Google reCAPTCHA (to stop spam), and the Meta Pixel used for PageView measurement.</li>
        <li>From documents you voluntarily share so we can check eligibility before a bank file is opened.</li>
      </ul>

      <LegalH2>4. Why we use your information</LegalH2>
      <p>We use personal data only for these purposes:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>To contact you about your loan enquiry and explain product options.</li>
        <li>To assess indicative eligibility and prepare a file for partner banks or NBFCs.</li>
        <li>To share your enquiry with one or more lenders who may be able to sanction the loan.</li>
        <li>To send the EMI calculation PDF you requested.</li>
        <li>To improve the website, prevent fraud and bot submissions, and keep records required by law.</li>
        <li>To send service updates. Marketing messages (offers, newsletters) are sent only where you have agreed, and you can opt out at any time by emailing info@blinkfinance.in or texting STOP on WhatsApp.</li>
      </ul>
      <p>We do not sell your personal data to data brokers or unrelated advertisers.</p>

      <LegalH2>5. Who we share it with</LegalH2>
      <p>We share data only as needed to provide the service:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><span className="font-bold text-foreground">Partner banks and NBFCs</span> — so they can evaluate, sanction, and service a loan. They apply their own KYC, credit-bureau, and privacy rules.</li>
        <li><span className="font-bold text-foreground">Email follow-up</span> — enquiry and EMI-download forms are emailed to sharanyapoojari@blinkfinance.in so our team can contact you about your request.</li>
        <li><span className="font-bold text-foreground">Google</span> — reCAPTCHA to protect forms from automated abuse.</li>
        <li><span className="font-bold text-foreground">Meta Platforms</span> — Pixel ID 1259468422917580, to measure website visits from ads. This does not give us access to your Facebook password or private messages.</li>
        <li><span className="font-bold text-foreground">Hosting and IT</span> — our website host (currently Hostinger) stores the site and server logs.</li>
        <li><span className="font-bold text-foreground">Professional advisers and authorities</span> — if required by law, a court, or to protect our legal rights.</li>
      </ul>
      <p>Some of these providers may process data on servers outside India. Where that happens, we still remain responsible for how we collected it and we only use providers we consider reasonably secure for this purpose.</p>

      <LegalH2>6. Cookies and similar tools</LegalH2>
      <p>
        We use essential cookies so the site works (for example, to remember a form you just submitted). We also use reCAPTCHA and the Meta Pixel described above.
        You can block cookies in your browser; some form protection may then fail. Browser “Do Not Track” signals are not uniformly honoured; use cookie settings and ad preferences on Google/Meta as well if you wish to limit ads.
      </p>

      <LegalH2>7. How long we keep data</LegalH2>
      <p>
        Enquiry and contact records are kept for as long as we are assisting you, and thereafter for a reasonable period (typically up to 36 months) so we can
        answer follow-ups, handle complaints, and meet tax or legal record needs. EMI PDF lead details are treated the same way. Server logs are kept for a shorter operational period.
        When we no longer need data, we delete it or keep only anonymised statistics. Lenders may retain copies under their own regulatory obligations even after we delete our copy.
      </p>

      <LegalH2>8. Security</LegalH2>
      <p>
        We use HTTPS, form spam controls, access limited to authorised staff, and we do not store payment-card data on this website.
        No internet transmission is completely secure. Please do not send OTPs, full card details, or scanned Aadhaar over unsecured public Wi-Fi if you can avoid it.
      </p>

      <LegalH2>9. Your rights under the DPDP Act</LegalH2>
      <p>Subject to law, you may:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Ask for a summary of the personal data we hold about you.</li>
        <li>Ask us to correct incomplete or inaccurate data.</li>
        <li>Ask us to erase data we no longer need for a lawful purpose.</li>
        <li>Withdraw consent for marketing, and (where processing is based only on consent) for other uses, without affecting earlier lawful processing.</li>
        <li>Nominate another person to exercise your rights in case of death or incapacity.</li>
        <li>Raise a grievance with our Grievance Officer (details below). If you are not satisfied, you may approach the Data Protection Board of India as provided under the DPDP Act.</li>
      </ul>
      <p>Write to info@blinkfinance.in with the subject “Privacy request”. We aim to respond within one month.</p>

      <LegalH2>10. Children</LegalH2>
      <p>
        Our loan-facilitation services are for persons aged 18 years or older (or for a business represented by an authorised adult).
        We do not knowingly collect personal data from children. If you believe a minor has submitted details, contact us and we will delete them.
      </p>

      <LegalH2>11. Grievance Officer</LegalH2>
      <p>
        <span className="font-bold text-foreground">Name:</span> Ashish Ashok Ghadge, Managing Partner<br />
        <span className="font-bold text-foreground">Email:</span> info@blinkfinance.in<br />
        <span className="font-bold text-foreground">Phone:</span> 8828821333<br />
        <span className="font-bold text-foreground">Address:</span> FF-12 and FF-13, Delta Vrindavan, G Wing, MIDC Rd, Mira Road East, Mira Bhayandar, Maharashtra 401107
      </p>
      <p>Office hours: Monday to Saturday, 9:00 a.m. to 7:00 p.m. IST (closed on public holidays unless otherwise notified).</p>

      <LegalH2>12. Changes to this policy</LegalH2>
      <p>
        We may update this page when our processes, tools, or the law change. The “Last updated” date at the top will change.
        Continued use of the website after an update means you have read the revised policy. Material changes will also be highlighted on the site where practical.
      </p>

      <LegalH2>13. Related documents</LegalH2>
      <p>
        Use of the website is also governed by our{' '}
        <Link to="/terms" className="text-brand-orange font-bold">Terms &amp; Conditions</Link>.
      </p>
    </LegalLayout>
  );
}
