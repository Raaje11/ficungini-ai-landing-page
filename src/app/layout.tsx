import type { Metadata } from "next";
import { DM_Sans, Fira_Code, Roboto_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ficungini - Procurement intelligence for tender professionals",
  description:
    "Built for the professionals who analyze, validate, and craft complex bids. Get instant Go/No-Go recommendations, compliance flags, and market intelligence for every tender.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${dmSans.variable} ${firaCode.variable} ${robotoMono.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
