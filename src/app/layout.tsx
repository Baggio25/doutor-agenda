import "./globals.css";

import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doutor Agenda",
  description: "Saas de agendamento de consultas médicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${manrope.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        {children}

        <Toaster position="bottom-center" richColors theme="light" />
      </body>
    </html>
  );
}
