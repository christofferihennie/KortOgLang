import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import { buttonVariants } from "../ui/button"
import { PrimaryHeader, QuaternaryHeader } from "./text"

export function Header({
  title,
  subtitle,
  back,
  className,
}: {
  title: string
  subtitle?: string
  back?: boolean
  className?: string
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
      {back && (
        <Link
          to=".."
          className={buttonVariants({ variant: "link", size: "icon" })}
        >
          <ArrowLeftIcon className="size-6 text-foreground" />
        </Link>
      )}
    </header>
  )
}
