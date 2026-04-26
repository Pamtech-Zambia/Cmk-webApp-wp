import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Authentication error",
  robots: { index: false, follow: false },
}

export default function AuthErrorPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We could not finish signing you in. Please try again, and if the issue
          persists contact the site owner.
        </p>
        <Button asChild className="mt-6">
          <Link href="/auth/login">Back to sign in</Link>
        </Button>
      </div>
    </main>
  )
}
