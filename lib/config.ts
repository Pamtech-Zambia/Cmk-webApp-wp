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
  // Sabbath observance window. Friday sunset to Saturday sunset.
  // Hours are local hours (24h) in the timezone below. Default 18:00 (6pm)
  // is a sensible year-round approximation for Lusaka, Zambia.
  sabbath: {
    timeZone: "Africa/Lusaka",
    fridaySunsetHour: 18, // 6:00 PM Friday — Sabbath begins
    saturdaySunsetHour: 18, // 6:00 PM Saturday — Sabbath ends
  },
}

export function buildWhatsappUrl(message: string) {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encoded}`
}
