import { cn } from "@/lib/utils"
import type React from "react"

interface TextComponentProps {
  children: React.ReactNode
  className?: string
}

export function PrimaryHeader({ children, className }: TextComponentProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        className
      )}
    >
      {children}
    </h1>
  )
}

export function SecondaryHeader({ children, className }: TextComponentProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
    >
      {children}
    </h1>
  )
}

export function Paragraph({ children, className }: TextComponentProps) {
  return <p className={cn("leading-7 not-first:mt-6", className)}>{children}</p>
}
