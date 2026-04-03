import { cn } from "@/lib/utils"
import { PrimaryHeader, QuaternaryHeader } from "./text"

export function Header({
  title,
  subtitle,
  className,
  children,
}: {
  title: string
  subtitle?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <header
      className={cn(
        className,
        "-mx-2 flex items-center justify-between border-b py-4"
      )}
    >
      <div>
        <PrimaryHeader>{title}</PrimaryHeader>
        {subtitle && <QuaternaryHeader>{subtitle}</QuaternaryHeader>}
      </div>
      {children}
    </header>
  )
}
