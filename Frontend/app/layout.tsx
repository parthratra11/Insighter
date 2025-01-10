import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Media Analytics",
  description: "Created by part-time students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
