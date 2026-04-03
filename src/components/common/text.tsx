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
        "scroll-m-20 text-3xl font-extrabold tracking-tight text-balance",
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
        "scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0",
        className
      )}
    >
      {children}
    </h1>
  )
}

export function TertiaryHeader({ children, className }: TextComponentProps) {
  return (
    <h3
      className={cn(
        className,
        "scroll-m-20 text-xl font-semibold tracking-tight text-foreground/75"
      )}
    >
      {children}
    </h3>
  )
}

export function QuaternaryHeader({ children, className }: TextComponentProps) {
  return (
    <h4
      className={cn(
        className,
        "scroll-m-20 text-xl font-medium tracking-tight text-foreground/75"
      )}
    >
      {children}
    </h4>
  )
}

export function Paragraph({ children, className }: TextComponentProps) {
  return <p className={cn("leading-7 not-first:mt-6", className)}>{children}</p>
}
