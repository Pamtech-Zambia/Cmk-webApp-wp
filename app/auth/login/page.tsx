import type { Metadata } from "next"
import { LoginForm } from "@/components/login-form"
import { BrandLogo } from "@/components/brand-logo"

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const params = await searchParams
  const next = params?.next ?? "/cmk"
  const errorParam = params?.error

  return (
    <main className="grid min-h-dvh place-items-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo size="lg" />
          <h1 className="mt-4 font-serif text-2xl font-bold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage products, promos and inquiries.
          </p>
        </div>
        <LoginForm next={next} initialError={errorParam} />
      </div>
    </main>
  )
}
