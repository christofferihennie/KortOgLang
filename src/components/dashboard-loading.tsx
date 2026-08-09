import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { LoadingTable } from "@/components/loading/table"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardLoading() {
  return (
    <>
      <Skeleton className="mb-4 h-10 w-48" />
      <Skeleton className="h-8 w-44" />
      <div className="my-2 max-w-full">
        <div className="flex gap-2 overflow-x-auto py-4 pl-2">
          {Array.from({ length: 3 }, (_, index) => (
            <Card key={`active-game-loading-${index}`} className="min-w-80">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="h-full space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-18" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-6 w-16 rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Separator className="my-2" />
      <Skeleton className="h-8 w-40" />
      <Separator className="my-2" />
      <LoadingTable rows={10} />
    </>
  )
}
