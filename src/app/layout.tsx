import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import type { PropsWithChildren } from "react";

const geistSans = localFont({
  variable: "--font-geist-sans",
  src: [
    { path: "../../public/fonts/geist-latin-ext.woff2", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/geist-latin.woff2", weight: "100 900", style: "normal" },
  ],
  display: "swap",
});

const niconne = localFont({
  variable: "--font-niconne",
  src: [
    { path: "../../public/fonts/niconne-latin-ext.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/niconne-latin.woff2", weight: "400", style: "normal" },
  ],
  display: "swap",
});

const serif = localFont({
  variable: "--font-serif",
  src: [
    { path: "../../public/fonts/petit-formal-script-latin-ext.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/petit-formal-script-latin.woff2", weight: "400", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Renan e Danielle",
  description: "Nosso casamento",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${serif.variable} ${niconne.variable} antialiased text-green`}
      >
        {children}
      </body>
    </html>
  );
}
