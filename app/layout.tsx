import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkedIn AI Content Generator",
  description: "Generate engaging LinkedIn posts about trending AI topics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
