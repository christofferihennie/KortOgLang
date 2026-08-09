import { Skeleton } from "@/components/ui/skeleton"

export function FinishedGameLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-48" />
      <div className="flex justify-center">
        <Skeleton className="h-36 w-64" />
      </div>
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
}
