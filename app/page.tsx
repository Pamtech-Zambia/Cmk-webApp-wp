import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Countdown } from "@/components/countdown"
import { WishesSection } from "@/components/wishes-section"
import { StoreSection } from "@/components/store-section"
import { AboutSection } from "@/components/about-section"
import { SiteFooter } from "@/components/site-footer"
import { SabbathBanner } from "@/components/sabbath-banner"
import { PromosSection } from "@/components/promos-section"

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <SabbathBanner />
      <Hero />
      <Countdown />
      <PromosSection />
      <WishesSection />
      <StoreSection />
      <AboutSection />
      <SiteFooter />
    </main>
  )
}
