"use client"

import { useState } from "react"
import { Users, Plus, Trash2, Mail, Calendar, Shield } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"

type AdminProfile = {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  created_at: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, {
    dateStyle: "medium",
  })
}

export function CmkAdminsDashboard({
  initialAdmins,
  currentUserId,
}: {
  initialAdmins: AdminProfile[]
  currentUserId: string
}) {
  const [admins, setAdmins] = useState<AdminProfile[]>(initialAdmins)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()

    if (!email.trim()) {
      toast.error("Email is required")
      return
    }
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setCreating(true)
    try {
      const res = await fetch("/api/cmk/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          fullName: fullName.trim() || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Could not create admin")

      setAdmins((prev) => [json.admin, ...prev])
      toast.success(`${json.admin.email} added as admin`)
      setDialogOpen(false)
      setEmail("")
      setPassword("")
      setFullName("")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not create admin"
      toast.error(msg)
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(admin: AdminProfile) {
    if (admin.id === currentUserId) {
      toast.error("You cannot remove your own admin access")
      return
    }

    if (!confirm(`Remove admin access from ${admin.email}? They will no longer be able to access this dashboard.`)) {
      return
    }

    setDeletingId(admin.id)
    try {
      const res = await fetch(`/api/cmk/admins/${admin.id}`, {
        method: "DELETE",
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Could not remove admin")

      setAdmins((prev) => prev.filter((a) => a.id !== admin.id))
      toast.success(`${admin.email} is no longer an admin`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not remove admin"
      toast.error(msg)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Team
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Admin Users
            </h1>
            <p className="mt-2 text-pretty text-muted-foreground">
              Manage who can access the admin dashboard.
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full gap-2">
                <Plus className="h-4 w-4" aria-hidden />
                Add admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle className="font-serif">Add new admin</DialogTitle>
                  <DialogDescription>
                    Create a new admin account. They&apos;ll be able to manage products, promos, and inquiries.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="admin-name">Name</FieldLabel>
                      <Input
                        id="admin-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jane Doe"
                        maxLength={100}
                      />
                      <FieldDescription>Optional display name</FieldDescription>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="admin-email">Email</FieldLabel>
                      <Input
                        id="admin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="admin-password">Password</FieldLabel>
                      <Input
                        id="admin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        minLength={8}
                        required
                      />
                      <FieldDescription>
                        Strong password with at least 8 characters
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={creating}
                    className="rounded-full gap-2"
                  >
                    {creating ? <Spinner className="h-4 w-4" /> : null}
                    {creating ? "Creating..." : "Create admin"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {admins.length === 0 ? (
          <Empty className="rounded-3xl border border-dashed border-border bg-card/60">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users className="h-6 w-6" aria-hidden />
              </EmptyMedia>
              <EmptyTitle>No admins found</EmptyTitle>
              <EmptyDescription>
                This shouldn&apos;t happen. Please contact support.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-3">
            {admins.map((admin) => {
              const isCurrentUser = admin.id === currentUserId
              const isDeleting = deletingId === admin.id

              return (
                <div
                  key={admin.id}
                  className={`flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between ${
                    isCurrentUser ? "border-primary/30 bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                      <Shield className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-serif text-lg font-semibold">
                          {admin.full_name || "Unnamed Admin"}
                        </h3>
                        {isCurrentUser && (
                          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            You
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" aria-hidden />
                          {admin.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" aria-hidden />
                          Joined {formatDate(admin.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(admin)}
                      disabled={isCurrentUser || isDeleting}
                      title={isCurrentUser ? "You cannot remove yourself" : "Remove admin access"}
                    >
                      {isDeleting ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" aria-hidden />
                      )}
                      <span className="sr-only">Remove admin</span>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-border bg-secondary/30 p-5">
          <h3 className="font-serif text-sm font-semibold">Security note</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Admin users have full access to manage products, promotions, inquiries, and site settings.
            Only add people you trust. Removing an admin revokes their access immediately but does not delete their account.
          </p>
        </div>
      </main>
    </div>
  )
}
