import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact — Ivedian" };

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="max-w-xl mx-auto mt-24 mb-24 px-6 flex-1">
        <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-3">Contact</p>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Get in touch</h1>
        <p className="text-base text-gray-500 mb-12">Questions about Ivedian or interested in early access? We'd love to hear from you.</p>

        <div className="grid grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</h3>
            <a href="mailto:info@ivedian.com" className="text-sm text-blue-600 hover:underline">info@ivedian.com</a>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Response time</h3>
            <p className="text-sm text-gray-700">We reply within 1 business day.</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Address</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              5900 Balcones Drive Suite 100<br />
              Austin, TX 78731<br />
              United States
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Early access</h3>
            <p className="text-sm text-gray-700">We're onboarding med spas now. Email us to get started.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
