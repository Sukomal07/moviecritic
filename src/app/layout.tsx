import type { Metadata } from "next";
import { Literata } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const literata = Literata({
  weight: "300",
  style: "normal",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Movie review app",
  description: "movie review app by sukomal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${literata.className} antialiased bg-gray-50`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
