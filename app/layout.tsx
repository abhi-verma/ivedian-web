import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ivedian — Automated Lead Follow-Up for Med Spas",
  description: "Ivedian sends a personalized SMS and email to every new lead within 2 minutes, then follows up automatically for 7 days.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
