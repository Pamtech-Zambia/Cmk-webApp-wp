import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Countdown } from "@/components/countdown"
import { WishesSection } from "@/components/wishes-section"
import { StoreSection } from "@/components/store-section"
import { AboutSection } from "@/components/about-section"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <Countdown />
      <WishesSection />
      <StoreSection />
      <AboutSection />
      <SiteFooter />
    </main>
  )
}
