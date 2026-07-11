import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Supercali Roleplay | Portal Utama Warga Gemilang",
  description: "Portal resmi Supercali Roleplay. Daftar Whitelist, Donasi Gemilang Jaya, Cek MDT SCVP, Rekam Medis ARC, dan Cetak Surat Dinas Resmi Anda!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
