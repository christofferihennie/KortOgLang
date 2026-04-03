import { Separator } from "../ui/separator"
import { PrimaryHeader, QuaternaryHeader } from "./text"

export function Header({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <header className="-mx-4 px-2 py-4">
      <PrimaryHeader>{title}</PrimaryHeader>
      {subtitle && <QuaternaryHeader>{subtitle}</QuaternaryHeader>}
      <Separator />
    </header>
  )
}
