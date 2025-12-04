import type { Metadata } from "next";
import { Geist, Niconne, Petit_Formal_Script } from "next/font/google";
import "./globals.css";
import type { PropsWithChildren } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const niconne = Niconne({
  variable: "--font-niconne",
  subsets: ["latin"],
  weight: "400",
});

const serif = Petit_Formal_Script({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
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
