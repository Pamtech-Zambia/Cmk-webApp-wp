import Image from "next/image"
import { Heart, Sparkles, Cake } from "lucide-react"
import { SITE_CONFIG } from "@/lib/config"

const STORY = [
  {
    icon: Heart,
    title: "Made with love",
    description:
      "Every bake is an act of care, made by hand for people who matter.",
  },
  {
    icon: Sparkles,
    title: "Always fresh",
    description: "We bake to order so each cake arrives at its very best.",
  },
  {
    icon: Cake,
    title: "Truly custom",
    description: "Tell us your story, your favorite flavors, and we'll make it real.",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-border shadow-xl">
            <Image
              src="/about-baking.jpg"
              alt="A baker decorating a cake with care"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-6 -right-2 rounded-2xl border border-border bg-card p-5 shadow-xl sm:-right-6">
            <p className="font-serif text-3xl font-bold text-primary">100%</p>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Handcrafted
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Cake className="h-3.5 w-3.5" aria-hidden="true" />
            About {SITE_CONFIG.businessName}
          </span>

          <h2 className="mt-4 font-serif text-4xl font-bold text-foreground text-balance sm:text-5xl">
            Sweet memories, baked to order.
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {SITE_CONFIG.businessName} is a small, home-grown bakery dedicated to
            making your moments a little sweeter. Birthdays, anniversaries, weddings,
            or just because — we love it all.
          </p>

          <ul className="mt-8 grid gap-5">
            {STORY.map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
