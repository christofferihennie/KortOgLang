import { Skeleton } from "@/components/ui/skeleton"

export function ActiveGameLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-48" />
      <div className="flex flex-col items-center">
        <div className="my-6 grid w-3/4 grid-cols-3 items-end gap-2">
          <Skeleton className="h-20 w-10" />
          <Skeleton className="h-28 w-12" />
          <Skeleton className="h-14 w-10" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-4 w-24" />
          ))}
        </div>
      </div>
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  )
}
