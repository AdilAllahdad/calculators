import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Construction Calculators",
  description: "A comprehensive collection of construction calculators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <header className="bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg py-4 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-blue-100 transition-colors">
              🏗️ Construction Calculators
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="text-white hover:text-blue-100 font-medium transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/calculators" className="text-white hover:text-blue-100 font-medium transition-colors">
                    Calculators
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
