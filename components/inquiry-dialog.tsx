"use client"

import { useState } from "react"
import { HelpCircle, Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"

export function InquiryDialog({
  productId,
  productName,
  sizeLabel,
  trigger,
}: {
  productId?: string
  productName?: string
  sizeLabel?: string | null
  trigger?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !contact.trim() || !message.trim()) {
      toast.error("Please fill in all fields.")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId || null,
          product_name: productName || null,
          size_label: sizeLabel || null,
          customer_name: name.trim(),
          contact: contact.trim(),
          message: message.trim(),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Could not send inquiry")
      toast.success("Inquiry sent. We'll get back to you soon!")
      setName("")
      setContact("")
      setMessage("")
      setOpen(false)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not send inquiry"
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            <HelpCircle className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Inquire
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {productName ? `Ask about ${productName}` : "Send us an inquiry"}
          </DialogTitle>
          <DialogDescription className="text-pretty">
            {sizeLabel
              ? `Selected size: ${sizeLabel}. We'll reply on the contact you share below.`
              : "Tell us what you'd like to know — we'll reply on the contact you share below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="iq-name">Your name</FieldLabel>
              <Input
                id="iq-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                maxLength={120}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="iq-contact">Phone or email</FieldLabel>
              <Input
                id="iq-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+260 97 123 4567 or you@email.com"
                maxLength={200}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="iq-message">Your question</FieldLabel>
              <Textarea
                id="iq-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Is this available for Saturday delivery? Can you do a custom flavour?"
                rows={4}
                maxLength={2000}
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-full" disabled={submitting}>
              {submitting ? (
                <Spinner className="mr-1.5" />
              ) : (
                <Send className="mr-1.5 h-4 w-4" aria-hidden="true" />
              )}
              {submitting ? "Sending..." : "Send inquiry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
