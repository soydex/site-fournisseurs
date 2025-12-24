import Layout from "@/components/ui/Layout";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";
import { NotificationContainer } from "@/components/ui/NotificationToast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Com Y Média",
    default: "Nouvelle Demande | Com Y Média",
  },
  description: "Plateforme de gestion des demandes d'affichage et logistique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationProvider>
          <Layout>{children}</Layout>
          <NotificationContainer />
        </NotificationProvider>
      </body>
    </html>
  );
}
