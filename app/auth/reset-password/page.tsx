import { Metadata } from "next"
import { ResetPasswordForm } from "@/components/reset-password-form"

export const metadata: Metadata = {
  title: "Set New Password | CMK Admin",
  description: "Set your new admin password",
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm space-y-6">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Set New Password
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </header>
        <ResetPasswordForm />
      </div>
    </main>
  )
}
