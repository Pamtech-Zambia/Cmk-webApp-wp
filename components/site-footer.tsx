import Link from "next/link"
import { MessageCircle, Heart, LogIn } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { SITE_CONFIG, buildWhatsappUrl } from "@/lib/config"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-serif text-xl font-bold">
            <BrandLogo size="sm" />
            {SITE_CONFIG.businessName}
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {SITE_CONFIG.tagline}
          </p>
        </div>

        <div>
          <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-foreground">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="#celebrate" className="text-muted-foreground hover:text-primary">
                Celebrate
              </Link>
            </li>
            <li>
              <Link href="#wishes" className="text-muted-foreground hover:text-primary">
                Send a wish
              </Link>
            </li>
            <li>
              <Link href="#store" className="text-muted-foreground hover:text-primary">
                Order a cake
              </Link>
            </li>
            <li>
              <Link href="#about" className="text-muted-foreground hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary">
                <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                Admin Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-foreground">
            Order on WhatsApp
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            All orders are placed directly through WhatsApp for the fastest reply.
          </p>
          <a
            href={buildWhatsappUrl(`Hi ${SITE_CONFIG.businessName}!`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Open WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.businessName}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden="true" /> for {SITE_CONFIG.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
