import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CC Intranet",
  description: "Internes Portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Wir machen Sidebar bedingt (wird in der Komponente selbst gehandhabt - wenn user null, return null)
  // Das erlaubt uns, Login Page ohne Sidebar zu haben, wenn Sidebar null returned.
  // Aber das Layout erwartet flex, wenn Sidebar da ist. 
  // Besserer Weg: Sidebar rendern, und wenn sie null ist, ändert sich das Layout nicht "böse", 
  // aber wir müssen wissen, ob wir Padding brauchen.
  
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex bg-gray-50`}
      >
        <Sidebar />
        <main className="flex-1 overflow-y-auto h-screen p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
