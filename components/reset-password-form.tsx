"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsValidSession(!!session)
    })
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setSubmitting(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      password,
    })

    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    setSuccess(true)
    toast.success("Password updated successfully")
    
    // Redirect to login after a short delay
    setTimeout(() => {
      router.replace("/auth/login")
    }, 2000)
  }

  if (isValidSession === null) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isValidSession) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/auth/forgot-password"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Password updated</h2>
              <p className="text-sm text-muted-foreground">
                Redirecting you to login...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Updating...
              </>
            ) : (
              "Update password"
            )}
          </Button>
          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
              Back to login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
