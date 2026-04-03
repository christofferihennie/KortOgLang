import { cn } from "@/lib/utils"

export function CenterLayout({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(className, "mx-auto w-full max-w-3xl px-4")}>
      {children}
    </div>
  )
}
