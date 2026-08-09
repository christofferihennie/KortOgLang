import { clsx } from "clsx"
import type { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function humanReadableDate(date: Date): string {
  return date.toLocaleString("nb-NO", {
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}
