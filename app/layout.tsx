import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import "./globals.css";
import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-model";
import { PracticeModal } from "@/components/modals/practice-modal";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Vegabattle", // Update title here
  description: "Join the battle and enhance your coding skills with Vegabattle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Vegabattle</title>
        <meta name="description" content="Join the battle and enhance your coding skills with Vegabattle." />
        <link rel="icon" href="/hero.ico" /> {/* Add the favicon link */}
      </Head>
      <body className={nunito.variable}>
        <ClerkProvider>
          <Toaster />
          <ExitModal />
          <HeartsModal />
          <PracticeModal />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
