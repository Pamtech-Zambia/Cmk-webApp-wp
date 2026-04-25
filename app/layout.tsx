import type { Metadata, Viewport } from "next"
import { Geist, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { PwaRegister } from "@/components/pwa-register"
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
  applicationName: "CMK Baking",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CMK Baking",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-touch-icon.jpg",
  },
  openGraph: {
    title: "Happy Birthday Chimwemwe",
    description: "Send a birthday wish and order a cake from CMK Baking.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E8577B" },
    { media: "(prefers-color-scheme: dark)", color: "#E8577B" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
        <PwaRegister />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
