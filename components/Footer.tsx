import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 px-12 py-8 flex items-center justify-between text-sm text-gray-400 flex-wrap gap-3">
      <div>&copy; {new Date().getFullYear()} Ivedian. All rights reserved.</div>
      <div className="flex gap-6">
        <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
        <Link href="/contact" className="hover:text-gray-900">Contact</Link>
      </div>
    </footer>
  );
}
