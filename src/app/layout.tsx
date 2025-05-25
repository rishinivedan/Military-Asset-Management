'use client';

import React from "react";
import Sidebar from "@/components/Sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react"; 
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen bg-black text-white`}
      >
        <SessionProvider> {/* Wrap everything inside this */}
          <div className="flex flex-row w-full">
            <Sidebar />
            <main className="flex-grow p-6 overflow-auto">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
