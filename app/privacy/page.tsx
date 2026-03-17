import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — Ivedian" };

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="max-w-2xl mx-auto mt-16 mb-24 px-6 flex-1">
        <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">Legal</p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: March 15, 2025</p>

        <p className="text-sm text-gray-600 mb-4">This Privacy Policy describes how Ivedian ("we," "us," or "our") collects, uses, and shares information when you use our automated lead follow-up service ("Service"). By using the Service, you agree to the practices described in this policy.</p>

        <h2 className="text-lg font-bold mt-10 mb-3">1. Who We Are</h2>
        <p className="text-sm text-gray-600 mb-4">Ivedian provides an AI-powered lead follow-up platform for medical spa businesses. Our registered address is:</p>
        <p className="text-sm text-gray-600 mb-4">
          Ivedian<br />
          5900 Balcones Drive Suite 100<br />
          Austin, TX 78731<br />
          United States<br />
          <a href="mailto:hello@ivedian.com" className="text-blue-600 hover:underline">hello@ivedian.com</a>
        </p>

        <h2 className="text-lg font-bold mt-10 mb-3">2. Information We Collect</h2>
        <p className="text-sm text-gray-600 mb-3">We collect information in two ways: from our business customers (med spas) who integrate our Service, and from their end users (leads and prospective clients).</p>
        <p className="text-sm text-gray-600 mb-2"><strong>From business customers:</strong></p>
        <ul className="list-disc ml-5 mb-4 text-sm text-gray-600 space-y-1">
          <li>Business name, owner name, and contact email</li>
          <li>Billing information</li>
          <li>Twilio phone number and booking link</li>
        </ul>
        <p className="text-sm text-gray-600 mb-2"><strong>From end users (leads) via our customers' forms:</strong></p>
        <ul className="list-disc ml-5 mb-4 text-sm text-gray-600 space-y-1">
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Service interest (e.g., Botox, facials)</li>
          <li>Lead source (e.g., website form)</li>
        </ul>

        <h2 className="text-lg font-bold mt-10 mb-3">3. How We Use SMS and Email Messaging</h2>
        <div className="bg-blue-50 border-l-4 border-blue-600 px-5 py-4 rounded-r-lg mb-4">
          <p className="text-sm text-gray-800"><strong>SMS consent:</strong> End users receive SMS messages because they submitted an inquiry form operated by one of our business customers. By submitting that form, end users consent to receive automated SMS follow-up messages related to the service they inquired about. Message frequency varies. Standard message and data rates may apply.</p>
        </div>
        <p className="text-sm text-gray-600 mb-2">We use collected contact information to:</p>
        <ul className="list-disc ml-5 mb-4 text-sm text-gray-600 space-y-1">
          <li>Send personalized follow-up SMS and email messages on behalf of our business customers</li>
          <li>Deliver a 7-day automated nurture sequence related to the lead's service inquiry</li>
          <li>Send daily summary reports to business customers</li>
          <li>Send trial status and account notifications to business customers</li>
        </ul>
        <p className="text-sm text-gray-600 mb-4"><strong>Opt-out:</strong> End users can opt out of SMS messages at any time by replying <strong>STOP</strong> to any message. After opting out, no further SMS messages will be sent. To opt out of email, reply to any email with "unsubscribe" or use the unsubscribe link where provided.</p>

        <h2 className="text-lg font-bold mt-10 mb-3">4. How We Share Information</h2>
        <p className="text-sm text-gray-600 mb-2">We do not sell personal information. We share information only as follows:</p>
        <ul className="list-disc ml-5 mb-4 text-sm text-gray-600 space-y-1">
          <li><strong>Twilio:</strong> We use Twilio to send SMS messages. Lead phone numbers are transmitted to Twilio for this purpose.</li>
          <li><strong>Resend:</strong> We use Resend to send emails. Lead email addresses are transmitted to Resend for this purpose.</li>
          <li><strong>Anthropic:</strong> We use Anthropic's Claude API to generate message content. Lead name and service interest may be included in prompts.</li>
          <li><strong>Business customers:</strong> Lead data submitted through a customer's inquiry form is visible to that customer via their Ivedian dashboard.</li>
          <li><strong>Legal requirements:</strong> We may disclose information if required by law or to protect rights and safety.</li>
        </ul>

        <h2 className="text-lg font-bold mt-10 mb-3">5. Data Retention</h2>
        <p className="text-sm text-gray-600 mb-4">We retain lead data for as long as the associated business customer account is active. When an account is closed, lead data is deleted within 30 days. Business customers may request earlier deletion by contacting us at <a href="mailto:hello@ivedian.com" className="text-blue-600 hover:underline">hello@ivedian.com</a>.</p>

        <h2 className="text-lg font-bold mt-10 mb-3">6. Data Security</h2>
        <p className="text-sm text-gray-600 mb-4">We store data in a cloud-hosted PostgreSQL database (Supabase). Access is restricted to authorized personnel and automated systems. We use HTTPS for all data in transit. We do not store full payment card numbers.</p>

        <h2 className="text-lg font-bold mt-10 mb-3">7. Your Rights</h2>
        <p className="text-sm text-gray-600 mb-4">Depending on your location, you may have the right to access, correct, or delete personal information we hold about you. To make a request, contact us at <a href="mailto:hello@ivedian.com" className="text-blue-600 hover:underline">hello@ivedian.com</a>. We will respond within 30 days.</p>

        <h2 className="text-lg font-bold mt-10 mb-3">8. Children's Privacy</h2>
        <p className="text-sm text-gray-600 mb-4">Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children.</p>

        <h2 className="text-lg font-bold mt-10 mb-3">9. Changes to This Policy</h2>
        <p className="text-sm text-gray-600 mb-4">We may update this Privacy Policy from time to time. We will post the updated policy on this page with a revised "Last updated" date. Continued use of the Service after changes constitutes acceptance of the updated policy.</p>

        <h2 className="text-lg font-bold mt-10 mb-3">10. Contact Us</h2>
        <p className="text-sm text-gray-600 mb-2">If you have questions about this Privacy Policy or wish to exercise your rights, contact us at:</p>
        <p className="text-sm text-gray-600">
          Ivedian<br />
          5900 Balcones Drive Suite 100<br />
          Austin, TX 78731<br />
          <a href="mailto:hello@ivedian.com" className="text-blue-600 hover:underline">hello@ivedian.com</a>
        </p>
      </div>
      <Footer />
    </div>
  );
}
