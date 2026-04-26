"use client"

import { useState } from "react"
import { Settings, Cake, Globe, Clock } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SITE_CONFIG } from "@/lib/config"
import type { WishesOverride } from "@/lib/types"

type SettingsCardProps = {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
}

function SettingsCard({ title, description, icon, children }: SettingsCardProps) {
  return (
    <Card className="rounded-3xl border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="font-serif text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function CmkSettingsDashboard({
  initialWishesOverride,
}: {
  initialWishesOverride: WishesOverride
}) {
  const [wishesOverride, setWishesOverride] = useState<WishesOverride>(initialWishesOverride)
  const [wishesSaving, setWishesSaving] = useState(false)

  async function saveWishesOverride(next: WishesOverride) {
    setWishesSaving(true)
    try {
      const res = await fetch("/api/cmk/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "wishes_override", value: next }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Could not save")
      setWishesOverride(next)
      toast.success("Birthday section setting updated")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save"
      toast.error(msg)
    } finally {
      setWishesSaving(false)
    }
  }

  const birthdayStart = new Date(SITE_CONFIG.birthdayStart)
  const birthdayEnd = new Date(SITE_CONFIG.birthdayEnd)
  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "long", day: "numeric" })

  return (
    <div className="min-h-dvh bg-background">
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Configuration
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Manage site-wide settings and feature toggles.
          </p>
        </div>

        <div className="space-y-6">
          {/* Birthday Wishes Section Control */}
          <SettingsCard
            title="Birthday Wishes Section"
            description="Control when the birthday wishes section appears on the homepage"
            icon={<Cake className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className="rounded-xl bg-secondary/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Auto window: {formatDate(birthdayStart)} – {formatDate(birthdayEnd)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  By default, the section only shows during Melody&apos;s birthday window.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={wishesOverride === null ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => saveWishesOverride(null)}
                  disabled={wishesSaving}
                >
                  {wishesSaving && wishesOverride !== null && wishesOverride !== "on" && wishesOverride !== "off" ? (
                    <Spinner className="mr-2 h-3 w-3" />
                  ) : null}
                  Auto (birthday window)
                </Button>
                <Button
                  variant={wishesOverride === "on" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => saveWishesOverride("on")}
                  disabled={wishesSaving}
                >
                  {wishesSaving && wishesOverride === "on" ? (
                    <Spinner className="mr-2 h-3 w-3" />
                  ) : null}
                  Always show
                </Button>
                <Button
                  variant={wishesOverride === "off" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => saveWishesOverride("off")}
                  disabled={wishesSaving}
                >
                  {wishesSaving && wishesOverride === "off" ? (
                    <Spinner className="mr-2 h-3 w-3" />
                  ) : null}
                  Always hide
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Current status:{" "}
                <span className="font-medium text-foreground">
                  {wishesOverride === "on"
                    ? "Always showing"
                    : wishesOverride === "off"
                      ? "Always hidden"
                      : "Following birthday window"}
                </span>
              </p>
            </div>
          </SettingsCard>

          {/* Site Info Card */}
          <SettingsCard
            title="Site Information"
            description="Basic information about your site"
            icon={<Globe className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Business Name</span>
                <span className="text-sm font-medium">{SITE_CONFIG.businessName}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">Owner</span>
                <span className="text-sm font-medium">{SITE_CONFIG.ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">WhatsApp</span>
                <span className="text-sm font-medium">{SITE_CONFIG.whatsapp}</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              To change these values, edit the <code className="rounded bg-secondary px-1 py-0.5">lib/config.ts</code> file.
            </p>
          </SettingsCard>
        </div>
      </main>
    </div>
  )
}
