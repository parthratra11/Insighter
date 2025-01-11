import "./globals.css";
import { App } from "./page";

export const metadata = {
  title: "Social Media Analytics",
  description: "Created by part-time students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
