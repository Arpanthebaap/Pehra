import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pehra — read the paperwork before it reads you",
  description:
    "Pehra reads rent agreements, job contracts and legal notices against Indian law, shows you which clauses cannot bind you, which protections are missing, and which deadlines are already running.",
  applicationName: "Pehra",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Never disable zoom. A user who needs to pinch to read is exactly our user.
  maximumScale: 5,
  themeColor: "#fbfaf7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
