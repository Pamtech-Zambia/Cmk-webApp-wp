import { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ReviewsPageContent } from "@/components/reviews-page-content"

export const metadata: Metadata = {
  title: "Customer Reviews | CMK Baking",
  description:
    "Read reviews from happy customers or share your experience with CMK Baking. We love hearing from you!",
}

export default function ReviewsPage() {
  return (
    <main>
      <SiteHeader />
      <ReviewsPageContent />
      <SiteFooter />
    </main>
  )
}
