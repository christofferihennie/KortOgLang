import { LoadingTable } from "@/components/loading/table"
import { Skeleton } from "@/components/ui/skeleton"

export function FinishedGamesLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-64" />
      <LoadingTable />
    </div>
  )
}
