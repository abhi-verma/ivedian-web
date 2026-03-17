import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-12 py-5 border-b border-gray-100">
      <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
        Ivedian
      </Link>
      <div className="flex gap-8 text-sm text-gray-500">
        <Link href="/#how-it-works" className="hover:text-gray-900">How it works</Link>
        <Link href="/contact" className="hover:text-gray-900">Contact</Link>
      </div>
    </nav>
  );
}
