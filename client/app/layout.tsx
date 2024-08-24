import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/style/globals.css";
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'E-commerce App | By Debraj Karmakar',
  description: 'A Next.js E-commerce Application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* This is the root layout for the entire application. */}
      <body className={inter.className}>
        {/* The outermost container for the entire page. */}
        <div className="flex flex-col min-h-screen">
          {/* The header component. */}
          <Header />
          {/* The main content area. */}
          <main className="flex-grow container mx-auto px-2 md:px-6 lg:px-20 py-8">
            {/* The actual content rendered by the active route. */}
            {children}
          </main>
          {/* The footer component. */}
          <Footer />
        </div>
        {/* The notifier component for displaying messages. */}
        <Toaster />
      </body>
    </html>
  );
}