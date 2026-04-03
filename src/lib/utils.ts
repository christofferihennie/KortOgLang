import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export const ROUNDS = [
  "Boks, Boks",
  "Boks, Rems",
  "Rems, Rems",
  "Boks, Boks, Rems",
  "Boks, Rems, Rems",
  "Boks, Boks, Boks",
  "Rems, Rems, Rems",
]
