import { Skeleton } from "@/components/ui/skeleton"

export function ProfileLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-40" />
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-9 w-20" />
        <div className="flex gap-2">
          <Skeleton className="size-9" />
          <Skeleton className="size-9" />
        </div>
      </div>
      <Skeleton className="h-[32rem] w-full" />
    </div>
  )
}
