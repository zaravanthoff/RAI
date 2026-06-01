import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

// One clean neo-grotesque throughout — studio-style, in the spirit of the
// reference site, paired with the project's warm palette.
const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RAI in Reels: Responsible-AI check",
  description:
    "Check whether your Generative-AI use in an Instagram Reel protects Gen Z brand trust, grounded in the study's emergent moderators.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
