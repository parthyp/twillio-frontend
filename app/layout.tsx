import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hotel Rates SMS Service",
  description: "Get daily hotel rates for your zipcode sent directly to your phone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
