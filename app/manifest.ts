import type { MetadataRoute } from "next"
import { SITE_CONFIG } from "@/lib/config"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `Happy Birthday ${SITE_CONFIG.name} — ${SITE_CONFIG.businessName}`,
    short_name: SITE_CONFIG.businessName,
    description: `Send a birthday wish to ${SITE_CONFIG.name} and order handcrafted cakes from ${SITE_CONFIG.businessName}.`,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFF4E8",
    theme_color: "#E8577B",
    categories: ["food", "lifestyle", "shopping"],
    icons: [
      {
        src: "/cmk-logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/cmk-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/cmk-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
