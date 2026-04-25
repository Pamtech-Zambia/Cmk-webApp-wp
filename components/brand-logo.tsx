import Image from "next/image"
import { cn } from "@/lib/utils"

type Size = "sm" | "md" | "lg"

const SIZE_MAP: Record<Size, { wrapper: string; img: number }> = {
  sm: { wrapper: "h-9 w-9", img: 36 },
  md: { wrapper: "h-11 w-11", img: 44 },
  lg: { wrapper: "h-14 w-14", img: 56 },
}

interface BrandLogoProps {
  size?: Size
  className?: string
}

export function BrandLogo({ size = "md", className }: BrandLogoProps) {
  const { wrapper, img } = SIZE_MAP[size]
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-border/40",
        wrapper,
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src="/cmk-logo.png"
        alt=""
        width={img}
        height={img}
        priority
        className="h-[88%] w-[88%] object-contain"
      />
    </span>
  )
}
