// Update these to match your real details
export const SITE_CONFIG = {
  name: "Chimwemwe",
  fullName: "Chimwemwe M. K.",
  birthdayMonth: 4, // April
  birthdayDay: 25,
  // WhatsApp number in international format, no + or spaces.
  // Example: 265991234567 for Malawi +265 991 234 567
  whatsappNumber: "260974619781",
  businessName: "CMK Baking",
  tagline: "Handcrafted cakes, cookies & pastries with love",
}

export function buildWhatsappUrl(message: string) {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encoded}`
}
