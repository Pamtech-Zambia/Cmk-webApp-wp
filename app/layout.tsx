import type { Metadata } from "next"
import { Geist, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Happy Birthday Chimwemwe — A Celebration",
  description:
    "Send a birthday wish to Chimwemwe and order handcrafted cakes, cookies, and pastries from CMK Baking. Delivered with love on April 25th.",
  generator: "v0.app",
  openGraph: {
    title: "Happy Birthday Chimwemwe",
    description: "Send a birthday wish and order a cake from CMK Baking.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster position="top-center" richColors />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
