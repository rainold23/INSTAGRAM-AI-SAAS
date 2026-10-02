import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instagram AI SaaS",
  description: "AI-powered Instagram content and analytics platform.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
